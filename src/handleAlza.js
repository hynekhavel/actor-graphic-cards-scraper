const Apify = require('apify');

const { ALZA_BASE_URL, ALZA } = require('./const');

exports.handleAlza = async ($) => {
    const requestQueue = await Apify.openRequestQueue();
    const nextPageHref = $('#pagerbottom a.pgn.sel')
        .next('a:not(.archive)')
        .attr('href');
    const items = $('.browsingitemcontainer .browsingitem');
    const output = [];

    // loop through all items in page
    for (let i = 0; i < items.length; i++) {
        const el = items.eq(i);
        const $el = $(el);

        // only add to output when item has price and is in stock
        if ($el.hasClass('canBuy') && $el.hasClass('inStockAvailability')) {
            output.push({
                shop: ALZA,
                name: $el.find('a.name').text(),
                price: $el.find('.c2').text(),
            });
        }
    }

    // if there is next page add URL to queue
    if (nextPageHref) {
        await requestQueue.addRequest(
            {
                url: `${ALZA_BASE_URL}${nextPageHref}`,
                userData: { label: ALZA },
            },
            { forefront: true },
        );
    }

    return output;
};
