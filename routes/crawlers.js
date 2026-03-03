var express = require('express');
var router = express.Router();
const Enum = require("../config/Enum");
const crawlerFactory = new (require("../lib/CrawlerFactory"));
const NatroCrawler = require("../lib/NatroCrawler");
const TurhostCrawler = require("../lib/TurhostCrawler");
let options = {}
crawlerFactory.registerCrawler(Enum.CRAWLER_TYPES.natro, new NatroCrawler({ options }));
crawlerFactory.registerCrawler(Enum.CRAWLER_TYPES.turhost, new TurhostCrawler({ options }));


/* GET home page. */

// /: ifadesi ile url çağrıldığında parametrik bir değer verileceği ifade edilir.
// Bu parametre 

router.get('/:crawlerType', async (req, res, next) => {

    let crawlerType = req.params["crawlerType"];  // req.params.crawlerType ile de çağırılabilir

    const crawlerInstance = crawlerFactory.getCrawler(crawlerType, {});

    let results = await crawlerInstance.crawl(Enum.CRAWLER_URLS[crawlerType]);

    res.json(results);
});

module.exports = router;
