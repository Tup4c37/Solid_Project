class CrawlerFactory {

    constructor() {
        this.crawlerMap = {};
    }

    registerCrawler(crawlerType, crawlerInstance) {
        this.crawlerMap[crawlerType] = crawlerInstance;
    }

    getCrawler(crawlerType, { options }) {
        const crawlerInstance = this.crawlerMap[crawlerType];
        if (!crawlerInstance) {
            throw new Error(`Crawler type ${crawlerType} not found`);
        }
        return crawlerInstance;
    }
}


module.exports = CrawlerFactory;
