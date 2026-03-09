var express = require('express');
var router = express.Router();
const moment = require('moment');
const { DATE_FORMAT } = require('../config/Enum');
const Prices = require('../db/models/Prices');
const Companies = require('../db/models/Companies');
const Domains = require('../db/models/Domains');
const Model = require('../lib/Model');
const DateProcess = require('../lib/DateProcess');
const Enum = require('../config/Enum');

/* GET home page. */
router.post('/', async (req, res, next) => {

    let date = DateProcess.getDateQuery(req.query.date);

    let results = await Prices.find({ date }).sort({ domain: 1 }).populate("domain").populate("company");
    //populate fonksiyonu ile yazılan alanı object id ile referanstaki içeriğe sorgu atarak ilgili alanın tüm fieldlarını getirir

    let domains = Model.groupByDomain(results);

    res.json(domains);

});

router.post('/domain/:extension', async (req, res, next) => {
    let extension = req.params.extension;
    let date = DateProcess.getDateQuery(req.query.date);

    let domain = await Domains.findOne({ domain: extension });

    if (domain) {
        let results = await Prices.find({ domain: domain._id, date }).populate("company");
        let domains = Model.groupByDomain(results, domain);
        res.json(domains);
    } else {
        res.json({});
    }

});

router.post('/registrar/:company', async (req, res, next) => {
    let companySlug = req.params.company;
    let date = DateProcess.getDateQuery(req.query.date);

    let company = await Companies.findOne({ name: Enum.CRAWLER_TYPES[companySlug] });

    if (company) {

        let results = await Prices.find({ company: company._id, date }).populate("domain");

        for (let i = 0; i < results.length; i++) {
            results[i].company = company;
        }

        let domains = Model.groupByDomain(results);
        res.json(domains);

    } else {
        res.json({});
    }

});

module.exports = router;

