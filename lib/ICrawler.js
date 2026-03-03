const puppeteer = require("puppeteer");

class ICrawler {
    constructor({ options }) {
        if (new.target === ICrawler) {
            throw new Error("ICrawler is an abstract class and cannot be instantiated directly");
        }
        this.options = options;
    }

    async #preparePuppeteer(url) {
        // Launch the browser   
        const browser = await puppeteer.launch(this.options);

        // Create a page
        const page = await browser.newPage();

        // Go to your site
        await page.goto(url);

        return { page, browser };
    }

    async crawl(url) {

        let { page, browser } = await this.#preparePuppeteer(url);

        // Evaluate JavaScript
        const results = await page.evaluate(this.fetchData);

        console.log(results);
        console.log(results.length);

        // Close browser.
        await browser.close();

        return results;
    }

    async fetchData() {
        throw new Error("This method must be overriden in subclass");
    }
}

module.exports = ICrawler;