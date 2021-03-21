const Apify = require('apify');
const { handleAlza } = require('./handleAlza');
const { handleCzc } = require('./handleCzc');
const { handleMironet } = require('./handleMironet');
const { handleTsbohemia } = require('./handleTsbohemia');

const { ALZA, CZC, MIRONET, TSBOHEMIA } = require('./const');

const {
    utils: { log },
} = Apify;

const MAX_CONCURRENCY = 10;

Apify.main(async () => {
    let results = [];
    const { filter, useProxy, startUrlAlza, startUrlCzc, startUrlMironet, startUrlTsbohemia } = await Apify.getInput();

    const requestQueue = await Apify.openRequestQueue();

    await requestQueue.addRequest({
        url: startUrlAlza,
        userData: { label: ALZA },
    });
    await requestQueue.addRequest({
        url: startUrlCzc,
        userData: { label: CZC },
    });
    await requestQueue.addRequest({
        url: startUrlMironet,
        userData: { label: MIRONET },
    });
    await requestQueue.addRequest({
        url: startUrlTsbohemia,
        userData: { label: TSBOHEMIA },
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

            if (label === ALZA) {
                const resultsAlza = await handleAlza($);

                results = [...results, ...resultsAlza];
            } else if (label === CZC) {
                const resultsCzc = await handleCzc($);

                results = [...results, ...resultsCzc];
            } else if (label === MIRONET) {
                const resultsMironet = await handleMironet($);

                results = [...results, ...resultsMironet];
            } else if (label === TSBOHEMIA) {
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

    if (filter && filter.length) {
        results = results.filter((result) => {
            const parsedName = result.name.replace(/ /g, '').toLowerCase();

            for (const item of filter) {
                const parsedFilter = item.replace(/ /g, '').toLowerCase();

                return parsedName.search(parsedFilter) > -1;
            }
        });
    }

    if (results.length > 0) {
        await Apify.pushData({ results });
    }
});
