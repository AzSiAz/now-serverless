// https://www.novelupdates.com/nartist/{artist_slug}/
const artistsRegex = /https:\/\/www.novelupdates.com\/nartist\/(.*)\//
// https://www.novelupdates.com/nauthor/{author_slug}/
const authorsRegex = /https:\/\/www.novelupdates.com\/nauthor\/(.*)\//
// https://www.novelupdates.com/epublisher/{publisher_slug}/
const englishPublishersRegex = /https:\/\/www.novelupdates.com\/epublisher\/(.*)\//
// https://www.novelupdates.com/genre/{genre_slug}/
const genresRegex = /https:\/\/www.novelupdates.com\/genre\/(.*)\//
// https://www.novelupdates.com/group/{group_slug}/
const groupRegex = /https:\/\/www.novelupdates.com\/group\/(.*)\//
// https://www.novelupdates.com/language/{language_slug}/
const languagesRegex = /https:\/\/www.novelupdates.com\/language\/(.*)\//
// https://www.novelupdates.com/series/{novel_slug}/
const novelRegex = /https:\/\/www.novelupdates.com\/series\/(.*)\//
// https://www.novelupdates.com/ntype/{type_slug}/
const novelTypesRegex = /https:\/\/www.novelupdates.com\/ntype\/(.*)\//
// https://www.novelupdates.com/opublisher/{publisher_slug}/
const originalPublishersRegex = /https:\/\/www.novelupdates.com\/opublisher\/(.*)\//
// https://www.novelupdates.com/stag/{tag_slug}/
const tagsRegex = /https:\/\/www.novelupdates.com\/stag\/(.*)\//

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
    artistsRegex,
    authorsRegex,
    englishPublishersRegex,
    genresRegex,
    languagesRegex,
    novelTypesRegex,
    originalPublishersRegex,
    tagsRegex,
    groupRegex,
    novelRegex,
    extractSlug
}
