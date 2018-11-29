// @ts-check
const fetch = require("node-fetch").default
const cheerio = require("cheerio")
const { send, createError } = require("micro")
const { parse } = require("url")

const extractPagination = require("./utils/extractPagination")
const { extractSlug, novelRegex } = require("./utils/extractSlug")

/** 
 * @param {CheerioStatic} $
*/
const extractGroupData = ($) => {
    const isSelect = $("#grouplst").length > 0

    const pagination = extractPagination($)
    const website = $("table.groupinfo > tbody > tr > td > a").first().attr("href")
    const name = $("table.groupinfo > tbody > tr:nth-child(1) > td:nth-child(2)").first().text().trim()
    const releaseNumber = $("table.groupinfo > tbody > tr:nth-child(4) > td:nth-child(2)").first().text().trim()
    const series = isSelect ? 
        $(`#grouplst > option[value!="---"]`).map((_, el) => {
            const element = $(el)

            return {
                name: element.text().trim(),
                slug: extractSlug(element.attr("value"), novelRegex)
            }
        }).get()
        :
        $("table.groupinfo > tbody > tr:nth-child(3) > td:nth-child(2) > a").map((_, el) => {
            const element = $(el)

            return {
                name: element.text().trim(),
                slug: extractSlug(element.attr("href"), novelRegex)
            }
        }).get()
    const news = $("tr.bdrank.grpnews > td > div").map((_, el) => {
        const element = $(el).children()
        const dateToParse = element.last().prev().text().trim().replace(/\(/g, "").replace(/\)/g, "")

        return {
            title: element.last().text().trim(),
            date: new Date(dateToParse),
            link: element.last().attr("href").trim()
        }
    }).get()
    const release = $(".grp-release ~ #myTable > tbody > tr").map((i, el) => {
        const element = $(el).children()

        const date = element.first().text().trim()
        const releaseName = element.last().children().first().text().trim()
        const link = element.last().children().first().attr("href")
        const novelName = element.last().prev().children().first().text().trim()
        const novelSlug = element.last().prev().children().first().attr("href").trim()

        return {
            novelName,
            novelSlug,
            release_date: date,
            releaseName,
            releaseLink: `https:${link}`,
        }
    }).get()

    return {
        info: {
            name,
            website,
            releaseNumber,
        },
        series,
        news,
        chapters: {
            pagination,
            release,
        } 
    }
}

/**
 * @param {string} requestUrl
 * @returns {Promise<CheerioStatic>}
 */
const requestData$ = async (requestUrl) => {
    const params = parse(requestUrl, true).query
    if (!params.slug) throw createError(500, "missing slug")

    const url = params.page ? 
        `https://www.novelupdates.com/group/${params.slug}/?pg=${params.page}` : `https://www.novelupdates.com/group/${params.slug}`
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
        const data = extractGroupData($)

        return send(res, 200, {
            data
        })
    } catch (error) {
        return send(res, 500, error.message)
    }
}