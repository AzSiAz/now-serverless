// @ts-check
const got = require("got")
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, novelRegex } = require("./utils/extractSlug")

/**
 * @param {CheerioStatic} $
 * @returns {object[]}
 */
const extractNovelTypeData = ($) => {
    return $("#myTable > tbody > tr").map((i, el) => {
        const element = $(el)

        return {
            cover: element.first().find("div.searchpic > a > img").attr("src"),
            slug: extractSlug(element.first().find("a").attr("href"), novelRegex),
            rating: element.first().find(".lstrate").text().replace(")", "").replace("(", "").trim(),
            lang: element.find("td.orgalign > span").text(),
            name: element.last().find("a").text().trim(),
            genre: element.last().find(".gennew").map((i, el2) => $(el2).text().trim()).get(),
            releaseNumber: element.last().find(".sfstext").text().replace("Releases:", "").trim(),
            description: element.last().find("div.noveldesc").text().replace("more>>", "").replace("... ", "").replace("<<less", "").trim()
        }
    }).get()
}

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query

    const url = `https://www.novelupdates.com/completed-novels-listing/?pg=${params.page}`
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
        const data = extractNovelTypeData($)

        send(res, 200, {
            pagination,
            data
        })
    } catch (error) {
        send(res, 500, error.message)
    }
}
