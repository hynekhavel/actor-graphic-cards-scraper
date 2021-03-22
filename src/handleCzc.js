const Apify = require('apify');

const { CZC_BASE_URL, CZC } = require('./const');

exports.handleCzc = async ($) => {
    const requestQueue = await Apify.openRequestQueue();
    const nextPageHref = $('.paging a.active').next().attr('href');
    const items = $('.new-tile');
    const output = [];

    // loop through all items in page
    for (let i = 0; i < items.length; i++) {
        const el = items.eq(i);
        const $el = $(el);
        const name = $el.find('.tile-title a').text().trim();
        const price = $el.find('.price .price-vatin').text();
        const isInStock = $el.find('.availability-state-on-stock');

        // only add to output when item has price and is in stock
        if (price && $(isInStock).length) {
            output.push({
                shop: CZC,
                name,
                price,
            });
        }
    }

    // if there is next page add URL to queue
    if (nextPageHref) {
        await requestQueue.addRequest(
            {
                url: `${CZC_BASE_URL}${nextPageHref}`,
                userData: { label: CZC },
            },
            { forefront: true },
        );
    }

    return output;
};
