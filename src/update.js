// @ts-check
const got = require("got")
const cheerio = require("cheerio")
const { send } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, groupRegex, novelRegex } = require("./utils/extractSlug")


/** 
 * @param {CheerioStatic} $
*/
const extractUpdates = ($) => {
    return $(`#myTable > tbody > tr`).map((i, el) => {
        const element = $(el);

        const novelUrl = element.children().first().children().first().attr("href").trim();
        const novel = element.children().first().children().first().attr("title").trim();
        
        const releaseName = element.children().first().next().children().last().text().trim();
        const releaseLink = element.children().first().next().children().last().attr("href").trim();
        
        const group = element.children().last().children().first().attr("title").trim();
        const groupUrl = element.children().last().children().first().attr("href").trim();

        return {
            group,
            groupSlug: extractSlug(groupUrl, groupRegex),
            novel,
            novelSlug: extractSlug(novelUrl, novelRegex),
            releaseName,
            releaseLink: `https:${releaseLink}`
        };
    }).get()
}

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    const url = `https://www.novelupdates.com/?pg=${params.page}` 
    const request = await got(url)

    return cheerio.load(request.body)
}

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
module.exports = async (req, res) => {
    try {
        const $ = await requestData$(req.url)
        const updates = extractUpdates($)
        const pagination = extractPagination($)

        return send(res, 200, { 
            pagination,
            updates
        })
    } catch (error) {
        return send(res, 500, error.message)
    }
}
