const Apify = require('apify');

const { MIRONET_BASE_URL } = require('./const');

exports.handleMironet = async ($) => {
    const requestQueue = await Apify.openRequestQueue();
    const nextPageHref = $('.pagination .PageSel').prev().attr('href');
    const items = $('#productContainer > div');
    const output = [];

    for (let i = 0; i < items.length; i++) {
        const el = items.eq(i);
        const $el = $(el);
        const name = $el.find('.nazev h2').text().trim();
        const price = $el.find('.item_b_cena').text();

        if (price) {
            const stockId = $el.find('.skladovost').attr('rel');
            const isInStockResponse = await Apify.utils.requestAsBrowser({
                url: 'https://sklad.mironet.cz/jtd_axstoreShort.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                payload: `x=${stockId}`,
            });

            if (isInStockResponse.body.search('Skladem') > -1) {
                output.push({
                    shop: 'MIRONET',
                    name,
                    price,
                });
            }
        }
    }

    if (nextPageHref) {
        await requestQueue.addRequest(
            {
                url: `${MIRONET_BASE_URL}${nextPageHref}`,
                userData: { label: 'MIRONET' },
            },
            { forefront: true },
        );
    }

    return output;
};
