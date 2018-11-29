// @ts-check
const fetch = require("node-fetch").default
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, novelTypesRegex, novelRegex } = require("./utils/extractSlug")
const escapeCustom = require("./utils/escapeCustom")

/**
 * @param {CheerioStatic} $
 * @returns {object[]}
 */
const extractNovelTypesData = ($) => {
    return $("#myTable > tbody > tr").map((i, el) => {
        const element = $(el)

        return {
            cover: element.first().find("div.searchpic > a > img").attr("src"),
            slug: extractSlug(element.first().find("a").attr("href"), novelRegex),
            rating: element.first().find(".lstrate").text().replace(")", "").replace("(", "").trim(),
            lang: element.find("td.orgalign > span").text(),
            name: escapeCustom(element.last().find("a").text().trim()),
            genre: element.last().find(".gennew").map((i, el2) => $(el2).text().trim()).get(),
            releaseNumber: element.last().find(".sfstext").text().trim().replace("Releases:", ""),
            description: escapeCustom(element.last().find("div.noveldesc").text().replace("more>>", "").replace("... ", "").replace("<<less", "").trim())
        }
    }).get()
}

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    if (!params.slug) throw createError(500, "missing slug")

    const url = `https://www.novelupdates.com/ntype/${params.slug}/?pg=${params.page}`
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
        const data = extractNovelTypesData($)

        send(res, 200, {
            pagination,
            data
        })
    } catch (error) {
        send(res, 500, error.message)
    }
}
