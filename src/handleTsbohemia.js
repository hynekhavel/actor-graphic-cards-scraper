const Apify = require('apify');

const { TSBOHEMIA_BASE_URL } = require('./const');

exports.handleTsbohemia = async ($) => {
    const requestQueue = await Apify.openRequestQueue();
    const nextPageHref = $('.pagenav .cnt .numpage.active')
        .next('.numpage')
        .find('a')
        .attr('href');

    const items = $('#gallarea > .prodbox');
    const output = [];

    for (let i = 0; i < items.length; i++) {
        const el = items.eq(i);
        const $el = $(el);
        const name = $el.find('h2 a.stihref').text().trim();
        const price = $el.find('.price .wvat').text();
        const isInStockText = $el.find('.stiqty em').text();

        if (price && isInStockText.search('SKLADEM') > -1) {
            output.push({
                shop: 'TSBOHEMIA',
                name,
                price,
            });
        }
    }

    if (nextPageHref) {
        await requestQueue.addRequest(
            {
                url: `${TSBOHEMIA_BASE_URL}${nextPageHref}`,
                userData: { label: 'TSBOHEMIA' },
            },
            { forefront: true },
        );
    }

    return output;
};
