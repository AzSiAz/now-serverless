/**
 * @param {string} name
 * @returns {string}
 */
module.exports = (name) => {
    return name
        .replace(/\\/g, "\\\\")
        .replace(/\"/g, "\\\"")
        .replace(/\n/g, "\\n")
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
};
