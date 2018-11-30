// https://www.novelupdates.com/nartist/{artist_slug}/
const artistRegex = /https:\/\/www.novelupdates.com\/nartist\/(.*)\//
// https://www.novelupdates.com/nauthor/{author_slug}/
const authorRegex = /https:\/\/www.novelupdates.com\/nauthor\/(.*)\//
// https://www.novelupdates.com/genre/{genre_slug}/
const genreRegex = /https:\/\/www.novelupdates.com\/genre\/(.*)\//
// https://www.novelupdates.com/group/{group_slug}/
const groupRegex = /https:\/\/www.novelupdates.com\/group\/(.*)\//
// https://www.novelupdates.com/language/{language_slug}/
const languageRegex = /https:\/\/www.novelupdates.com\/language\/(.*)\//
// https://www.novelupdates.com/series/{novel_slug}/
const novelRegex = /https:\/\/www.novelupdates.com\/series\/(.*)\//
// https://www.novelupdates.com/ntype/{type_slug}/
const novelTypeRegex = /https:\/\/www.novelupdates.com\/ntype\/(.*)\//
// https://www.novelupdates.com/epublisher/{publisher_slug}/
// https://www.novelupdates.com/opublisher/{publisher_slug}/
const publisherRegex = /https:\/\/www.novelupdates.com\/[oe]publisher\/(.*)\//
// https://www.novelupdates.com/stag/{tag_slug}/
const tagRegex = /https:\/\/www.novelupdates.com\/stag\/(.*)\//

/**
 * 
 * @param {string} url
 * @param {RegExp} regex
 * @returns {string}
 */
const extractSlug = (url, regex) => {
    const match = url.match(regex);

    return match ? match[1] : "";
};

module.exports = {
    artistRegex,
    authorRegex,
    genreRegex,
    languageRegex,
    novelTypeRegex,
    tagRegex,
    groupRegex,
    novelRegex,
    publisherRegex,
    extractSlug
}
