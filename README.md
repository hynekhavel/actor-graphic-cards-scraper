# Graphics cards scraper

-   [Overview](#overview)
-   [Input](#input)
-   [Output](#output)
-   [CU consumption](#cu-consumption)

## Overview

This actor scrape all in-stock graphics cards in Czech E-shops. Output is saved to default dataset and contains: shop name, name of product and current price. Actor is lightweight and using only [CheerioCrawler](https://sdk.apify.com/docs/api/cheerio-crawler) for better [CU consumption](#cu-consumption) (no puppeteer). If you are interested only in some GPU models, you can filter saved data by input [**filter**](#input).

### Scraped E-shops

-   [alza.cz](https://alza.cz/)
-   [czc.cz](https://czc.cz/)
-   [mironet.cz](https://mironet.cz/)
-   [tsbohemia.cz](https://tsbohemia.cz/)

## Input

-   **filter** - Array of strings. List of GPU names (will be searched in E-shop title). If omitted all in-stock GPUs will be added to dataset. _Default: []_
-   **useProxy** - Boolean. When true, scraper will use czech residential proxy. _Default: true_
-   **startUrlAlza** - String. Starting scraping position for Alza, leave default. _Default: https://www.alza.cz/graficke-karty/18842862.htm_
-   **startUrlCzc** - String. Starting scraping position for CZC, leave default. _Default: https://www.czc.cz/graficke-karty/produkty_
-   **startUrlMironet** - String. Starting scraping position for Mironet, leave default. _Default: https://www.mironet.cz/graficke-karty+c14402_
-   **startUrlTsbohemia** - String. Starting scraping position for TSBohemia, leave default. _Default: https://www.tsbohemia.cz/elektronika-a-it-pc-komponenty-graficke-karty_c5581.html_

## Output

All scraped products will be saved to default run dataset in this format:

```
[{
  "results": [
    {
      "shop": "ALZA",
      "name": "GIGABYTE GeForce GT 710 1GB",
      "price": "999,-"
    },
    {
      "shop": "ALZA",
      "name": "HP NVIDIA Graphics PLUS Quadro P400",
      "price": "2 990,-"
    },
    {
      "shop": "MIRONET",
      "name": "MSI N730K-2GD3H",
      "price": "1 946 Kč"
    },
    {
      "shop": "MIRONET",
      "name": "PowerColor AXRX 580 8GBD5-DHDV2 OC",
      "price": "17 668 Kč"
    },
    {
      "shop": "TSBOHEMIA",
      "name": "GIGABYTE GeForce GT 710 GV-N710D5-1GL",
      "price": "1 049,-"
    },
    {
      "shop": "TSBOHEMIA",
      "name": "MSI GeForce GT 710 (GT 710 1GD3H LP)",
      "price": "999,-"
    },
  ]
}]
```

## CU consumption

Average compute units consumption with _1024 MB_ memory is about **0.015** CU.
