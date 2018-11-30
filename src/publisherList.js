// @ts-check
const fetch = require("node-fetch").default
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, publisherRegex } = require("./utils/extractSlug")

/**
 * @param {CheerioStatic} $
 * @returns {object[]}
 */
const extractPublisherListData = ($) => {
    return $("div.wpb_wrapper > ul > li").map((i, el) => {
        const element = $(el)

        return {
            name: element.find("a").text().trim(),
            slug: extractSlug(element.find("a").attr("href"), publisherRegex),
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

    const url = params.english 
        ? `https://www.novelupdates.com/list-english-publisher/?pg=${params.page}`
        : `https://www.novelupdates.com/list-original-publisher/?pg=${params.page}`

    const request = await fetch(url)
    const html = await request.text()

    return cheerio.load(html)
}

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
module.exports = async (req, res) => {
    try {
        const $ = await requestData$(req.url)
        const pagination = extractPagination($)
        const data = extractPublisherListData($)

        send(res, 200, {
            pagination,
            data
        })
    } catch (error) {
        send(res, 500, error.message)
    }
}