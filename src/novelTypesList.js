// @ts-check
const fetch = require("node-fetch").default
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, novelTypesRegex } = require("./utils/extractSlug")
const escapeCustom = require("./utils/escapeCustom")

/**
 * @param {CheerioStatic} $
 * @returns {object[]}
 */
const extractNovelTypesListData = ($) => {
    return $("div.wpb_wrapper > ul > li > a").map((i, el) => {
        const element = $(el)

        return {
            name: escapeCustom(element.text().trim()),
            slug: extractSlug(element.attr("href"), novelTypesRegex)
        }
    }).get()
}

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    const url = `https://www.novelupdates.com/list-types/?pg=${params.page}`
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
        const data = extractNovelTypesListData($)

        send(res, 200, {
            pagination,
            data
        })
    } catch (error) {
        send(res, 500, error.message)
    }
}