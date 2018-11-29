// @ts-check
const fetch = require("node-fetch").default
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    if (!params.slug) throw createError(500, "missing slug")

    const url = `https://www.novelupdates.com/ntype//?pg=${params.page}`
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
        // const $ = await requestData$(req.url)
        // const pagination = extractPagination($)
        // const data = extractNovelTypesData($)

        // send(res, 200, {
        //     pagination,
        //     data
        // })
        return "Pikachu"
    } catch (error) {
        // send(res, 500, error.message)
    }
}
