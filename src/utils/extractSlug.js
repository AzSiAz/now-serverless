const groupRegex = /https:\/\/www.novelupdates.com\/group\/(.*)\//
const novelRegex = /https:\/\/www.novelupdates.com\/series\/(.*)\//

const extractSlug = (url, regex) => {
    const match = url.match(regex);

    return match ? match[1] : "";
};

module.exports = {
    groupRegex,
    novelRegex,
    extractSlug
}
