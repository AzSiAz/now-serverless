// @ts-check
const got = require("got")
const cheerio = require("cheerio")
const { send } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, groupRegex } = require("./utils/extractSlug")

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    const url = params.page ? 
        `https://www.novelupdates.com/groupslist/?pg=${params.page}` : "https://www.novelupdates.com/groupslist"
    const request = await got(url)

    return cheerio.load(request.body)
}

/** 
 * @param {CheerioStatic} $
*/
const extractGroupList = ($) => {
    return $("div.wpb_wrapper > ul > li > a").map((i, el) => {
        const element = $(el);
    
        return {
            name: element.text(),
            slug: extractSlug(element.attr("href"), groupRegex),
        };
    }).get();
}

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
module.exports = async (req, res) => {
    try {
        const $ = await requestData$(req.url)
        const groupList = extractGroupList($)
        const pagination = extractPagination($)

        return send(res, 200, {
            pagination,
            groupList
        })
    } catch (error) {
        return send(res, 500, error.message)
    }
}