const fetch = require("node-fetch").default
const cheerio = require("cheerio")
const { send } = require("micro")
const { parse } = require("url")


const extractSlug = (url, regex) => {
    const match = url.match(regex);

    return match ? match[1] : "";
};

const extractPagination = ($) => {
    const maxPage = parseInt($("div.digg_pagination > a").last().prev("a").text(), 10) || 1;
    const currentPage = parseInt($("div.digg_pagination > em.current").text(), 10) || 1;
    const nextPage = parseInt(
        $("div.digg_pagination > a").first().text(),
        10,
    ) || 1;

    return {
        currentPage,
        maxPage,
        nextPage
    };
};


module.exports = async (req, res) => {
    // console.time("update")
    try {
        const params = parse(req.url, true).query
        url = params.page ? `https://www.novelupdates.com/?pg=${params.page}` : "https://www.novelupdates.com"
        const request = await fetch(url)
        const html = await request.text()
        const $ = cheerio.load(html)

        const updates = $(`#myTable > tbody > tr`).map((i, el) => {
            const element = $(el);

            const novelUrl = element.children().first().children().first().attr("href").trim();
            const novel = element.children().first().children().first().attr("title").trim();
            
            const releaseName = element.children().first().next().children().last().text().trim();
            const releaseLink = element.children().first().next().children().last().attr("href").trim();
            
            const group = element.children().last().children().first().attr("title").trim();
            const groupUrl = element.children().last().children().first().attr("href").trim();
    
            return {
                group,
                groupSlug: extractSlug(groupUrl, /https:\/\/www.novelupdates.com\/group\/(.*)\//),
                novel,
                novelSlug: extractSlug(novelUrl, /https:\/\/www.novelupdates.com\/series\/(.*)\//),
                releaseName,
                releaseLink: `https:${releaseLink}`
            };
        }).get()
        const pagination = extractPagination($)

        // console.timeEnd("update")
        return send(res, 200, { updates, pagination })
    } catch (error) {
        return send(res, 500, error.message)
    }

}