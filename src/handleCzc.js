const Apify = require('apify');

const { CZC_BASE_URL, CZC } = require('./const');

exports.handleCzc = async ($) => {
    const requestQueue = await Apify.openRequestQueue();
    const nextPageHref = $('.paging a.active').next().attr('href');
    const items = $('.new-tile');
    const output = [];

    for (let i = 0; i < items.length; i++) {
        const el = items.eq(i);
        const $el = $(el);
        const name = $el.find('.tile-title a').text().trim();
        const price = $el.find('.price .price-vatin').text();
        const isInStock = $el.find('.availability-state-on-stock');

        if (price && $(isInStock).length) {
            output.push({
                shop: CZC,
                name,
                price,
            });
        }
    }

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
