const fetch = require("isomorphic-unfetch")
const cheerio = require("cheerio")
const micro = require("micro")

const extractSlug = (url, regex) => {
    const match = url.match(regex);

    return match ? match[1] : "";
};

module.exports = async (req, res) => {
    // res.end(new Date().toString())
    console.time("update")
    try {
        const request = await fetch("https://www.novelupdates.com")
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

        console.timeEnd("update")
        return micro.send(res, 200, updates)
    } catch (error) {
        return micro.send(res, 500, error.message)
    }

}