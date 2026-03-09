const ICrawler = require("./ICrawler");

class NatroCrawler extends ICrawler {
    constructor({ options } = {}) {
        super({ options });
    }

    async fetchData() {
        return getData();

        function getData(results = []) {
            // Extract only the current price from cell
            // HTML: <td><strike><span>OLD $</span></strike> <span><span>NEW <span>$</span></span></span></td>
            // or:   <td><span><span>PRICE <span>$</span></span></span></td>
            function extractPrice(td) {
                // Get direct child spans (skip <strike> which has old price)
                let directSpans = td.querySelectorAll(":scope > span");
                let text;
                if (directSpans.length > 0) {
                    // Last direct span = current/discounted price
                    text = directSpans[directSpans.length - 1].innerText;
                } else {
                    text = td.innerText;
                }
                // Remove everything except digits and comma (strip $, spaces, etc.)
                return text.replace(/[^\d,]/g, '').trim();
            }

            let rows = document.querySelectorAll("#dataTable-Demo > tbody > tr")
            let localResults = Array.from(rows).map(row => {
                let columns = row.querySelectorAll("td");
                return {
                    domain: columns[0].querySelector("span a")?.innerText?.trim(),
                    type: columns[1].innerText?.trim(),
                    new_registration_fee: extractPrice(columns[2]),
                    renewal_fee: extractPrice(columns[3]),
                    transfer_fee: extractPrice(columns[4])
                }

            });
            let btnNextPage = document.querySelector("#dataTable-Demo_next");
            let isLastPage = !btnNextPage || btnNextPage.className?.includes("disabled");

            results = results.concat(localResults);

            if (!isLastPage) {
                btnNextPage.click();
                return getData(results);
            }

            return results;
        }
    }
}

module.exports = NatroCrawler;