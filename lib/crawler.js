require('chromedriver');
const { Builder, By, until } = require('selenium-webdriver');
const { URL, parse } = require('url');


module.exports = {
    Crawler: (
        class Crawler {

            constructor(args = {}) {
                try {
                    let options = new (require("selenium-webdriver/chrome")).Options();
                    if (args.local === true) {
                        options.addArguments("user-data-dir=C:\\Users\\Sheraz\\AppData\\Local\\Google\\Chrome\\User Data");
                    }
                    this.setDriver(options);
                } catch (e) {
                    console.log(e);
                }
            }

            quit() {
                this.driver.quit();
            }

            async setDriver(options) {
                this.driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
            }

            validUrl(s, protocols) {
                try {
                    new URL(s);
                    const parsed = parse(s);
                    return protocols
                        ? parsed.protocol
                            ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
                            : false
                        : true;
                } catch (err) {
                    return false;
                }
            }

            goto(url) {
                if (this.validUrl(url)) {
                    this.driver.get(url);
                } else {
                    console.log(url, " is not a valid url");
                }
            }

            async getElement(expression) {
                try {
                    await this.driver.wait(until.elementLocated(expression), 10);
                    return await this.driver.findElement(expression);
                } catch {
                    return null;
                }
            }

            async getElementByCss(selector) {
                return await this.getElement(By.css(selector));
            }

            async getElementByXpath(selector) {
                return await this.getElement(By.xpath(selector));
            }

            async getElementById(selector) {
                return await this.getElement(By.id(selector));
            }

        }

    )
}