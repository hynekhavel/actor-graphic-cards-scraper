const Apify = require('apify');

const { ALZA_BASE_URL, ALZA } = require('./const');

exports.handleAlza = async ($) => {
    const requestQueue = await Apify.openRequestQueue();
    const nextPageHref = $('#pagerbottom a.pgn.sel')
        .next('a:not(.archive)')
        .attr('href');
    const items = $('.browsingitemcontainer .browsingitem');
    const output = [];

    for (let i = 0; i < items.length; i++) {
        const el = items.eq(i);
        const $el = $(el);

        if ($el.hasClass('canBuy') && $el.hasClass('inStockAvailability')) {
            output.push({
                shop: ALZA,
                name: $el.find('a.name').text(),
                price: $el.find('.c2').text(),
            });
        }
    }

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
