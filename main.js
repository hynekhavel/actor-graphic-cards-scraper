const Apify = require('apify');
const { handleAlza } = require('./src/handleAlza');
const { handleCzc } = require('./src/handleCzc');
const { handleMironet } = require('./src/handleMironet');
const { handleTsbohemia } = require('./src/handleTsbohemia');

const {
    utils: { log },
} = Apify;

const MAX_CONCURRENCY = 10;

Apify.main(async () => {
    let results = [];
    const { filter, useProxy } = await Apify.getInput();

    const requestQueue = await Apify.openRequestQueue();

    const alzaStart = 'https://www.alza.cz/graficke-karty/18842862.htm';
    const czcStart = 'https://www.czc.cz/graficke-karty/produkty';
    const mironetStart = 'https://www.mironet.cz/graficke-karty+c14402/';
    const tsbohemiaStart =
        'https://www.tsbohemia.cz/elektronika-a-it-pc-komponenty-graficke-karty_c5581.html';

    await requestQueue.addRequest({
        url: alzaStart,
        userData: { label: 'ALZA' },
    });
    await requestQueue.addRequest({
        url: czcStart,
        userData: { label: 'CZC' },
    });
    await requestQueue.addRequest({
        url: mironetStart,
        userData: { label: 'MIRONET' },
    });
    await requestQueue.addRequest({
        url: tsbohemiaStart,
        userData: { label: 'TSBOHEMIA' },
    });

    const options = {
        requestQueue,
        maxConcurrency: MAX_CONCURRENCY,
        handlePageFunction: async ({
            request: {
                userData: { label },
                url,
            },
            $,
        }) => {
            log.info('Page opened.', { label, url });

            if (label === 'ALZA') {
                const resultsAlza = await handleAlza($);

                results = [...results, ...resultsAlza];
            } else if (label === 'CZC') {
                const resultsCzc = await handleCzc($);

                results = [...results, ...resultsCzc];
            } else if (label === 'MIRONET') {
                const resultsMironet = await handleMironet($);

                results = [...results, ...resultsMironet];
            } else if (label === 'TSBOHEMIA') {
                const resultsTsBohemia = await handleTsbohemia($);

                results = [...results, ...resultsTsBohemia];
            }
        },
    };

    if (useProxy) {
        options.proxyConfiguration = await Apify.createProxyConfiguration({
            groups: ['RESIDENTIAL'],
            countryCode: 'CZ',
        });
    }

    const crawler = new Apify.CheerioCrawler(options);
    await crawler.run();

    const filteredResults = results.filter((result) => {
        const parsedName = result.name.replace(/ /g, '').toLowerCase();

        for (const item of filter) {
            const parsedFilter = item.replace(/ /g, '').toLowerCase();

            return parsedName.search(parsedFilter) > -1;
        }
    });

    if (results.length > 0) {
        await Apify.pushData({ data: filteredResults });
    }
});
