require('chromedriver');

const express = require('express');
const router = express.Router();
const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');
var fs = require('fs');
var multer = require('multer');
var glob = require("glob")
const { URL, parse } = require('url');

const validUrl = (s, protocols) => {
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
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


async function saveLineCsv(filename, result) {
    result.map(string => string === null ? '' : `\"${string}\"`)
    csv = `"${result[0]}","${result[1]}"\n`
    try {
        fs.appendFileSync("./uploads/" + filename, csv);
    } catch (err) {
        console.error(err);
    }
}

// function saveAsCSV(filename, result) {
//     let csv = ``
//     result.map(string => string === null ? '' : `\"${string}\"`)
//     for (let i = 0; i < result.length; i++) {
//         csv += `"${result[i][0]}","${result[i][1]}"\n`;
//     }
//     try {
//         fs.writeFileSync("./uploads/" + filename, csv);
//     } catch (err) {
//         console.error(err);
//     }
// }

async function saveLocationInFile(filename, urls) {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        for (let i = 0; i < urls.length; i++) {
            if (validUrl(urls[i])) {
                await driver.get(urls[i].replace(/\/+$/, '') + '/about');
                try {
                    await driver.wait(until.elementLocated(By.css('strong')), 1);
                    result = [urls[i], await driver.findElement(By.css('strong')).getText()]
                } catch {
                    result = [urls[i], '']
                }
                saveLineCsv(filename, result)
            }
        }
    } finally {
        driver.quit()
    }
}

// async function getLocation(urls) {
//     let value = []
//     let driver = await new Builder().forBrowser("chrome").build();
//     try {
//         for (let i = 0; i < urls.length; i++) {
//             if (validUrl(urls[i])) {
//                 await driver.get(urls[i].replace(/\/+$/, '') + '/about');
//                 try {
//                     await driver.wait(until.elementLocated(By.css('strong')), 1);
//                     result = await driver.findElement(By.css('strong')).getText()
//                 } catch {
//                     result = ''
//                 }
//                 value.push([urls[i], result])
//             }
//         }
//     } finally {
//         driver.quit()
//     }
//     return value
// }

router.get('/', (req, res) => {
    res.render('index', { message: null })
});

router.get('/files', (req, res) => {
    glob("./uploads/*.csv", options = {}, function (er, f) {
        res.render('files', { files: f });
    })
});

router.get("/uploads/:name", (req, res) => {
    let filePath = path.join(__dirname, '..', 'uploads', req.params.name);
    res.download(filePath);
});

router.post('/file/upload', upload.single("file"), (req, res, next) => {
    const file = req.file; // We get the file in req.file

    if (!file) { // in case we do not get a file we return
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const multerText = Buffer.from(file.buffer).toString("utf-8"); // this reads and converts the contents of the text file into string
    // const result = await getLocation(multerText.split('\r\n'))
    // saveAsCSV('processed_' + req.file.originalname.replace('.txt', '.csv'), result)
    saveLocationInFile('processed_' + req.file.originalname.replace('.txt', '.csv'), multerText.split('\r\n'))
    res.render('index', { message: "File Uploaded Successfully" })
});

module.exports = router