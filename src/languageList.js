// @ts-check
const got = require("got")
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, languageRegex } = require("./utils/extractSlug")

/**
 * @param {CheerioStatic} $
 * @returns {object[]}
 */
const extractNovelTypeListData = ($) => {
    return $("div.wpb_wrapper > ul > li").map((i, el) => {
        const element = $(el)

        return {
            name: element.find("a").text().trim(),
            slug: extractSlug(element.find("a").attr("href"), languageRegex),
            novelNumber: element.text().match(/\d+/g)[0].trim()
        }
    }).get()
}

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    const url = `https://www.novelupdates.com/list-languages/?pg=${params.page}`
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
        const pagination = extractPagination($)
        const data = extractNovelTypeListData($)

        send(res, 200, {
            pagination,
            data
        })
    } catch (error) {
        send(res, 500, error.message)
    }
}