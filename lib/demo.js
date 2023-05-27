const { Crawler } = require("./crawler");

module.exports = async function vulms(userId, userPassword, courseCode) {
    let crawler = new Crawler({local: true});
    crawler.goto('https://vulms.vu.edu.pk');
    let uname = await crawler.getElementById('txtStudentID');
    await uname.click();
    await uname.clear();
    await uname.sendKeys(userId);
    let pass = await crawler.getElementById('txtPassword');
    await pass.click();
    await pass.clear();
    await pass.sendKeys(userPassword);
    let login = await crawler.getElementById('ibtnLogin');
    await login.click();
    let skip =  await crawler.getElementById('imgbtnSkip');
    if(skip){await skip.click();}
    let course = await crawler.getElementByXpath(`//*[contains(text(),"${courseCode}")]`);
    await course.click();
}