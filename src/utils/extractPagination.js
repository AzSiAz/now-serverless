module.exports = ($) => {
    // next_page
    const maxPage = parseInt(
        $("div.digg_pagination > a.next_page").prev("a").text() ?
        $("div.digg_pagination > a").last().prev("a").text() : $("div.digg_pagination > em.current").text(),
        10
    ) || 1;
    const currentPage = parseInt($("div.digg_pagination > em.current").text(), 10) || 1;
    const nextPage = parseInt($("div.digg_pagination > em.current").next().text(), 10) || 1;

    return {
        currentPage,
        maxPage,
        nextPage: nextPage <= currentPage ? undefined : nextPage
    };
};
