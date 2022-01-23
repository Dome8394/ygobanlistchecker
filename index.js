const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const port = 3000;
let oldDate = "Gültig ab 01/10/2021";
let result;
let url = 'https://www.yugioh-card.com/de/limited/';

const app = express();

let requestLoop = setInterval(() => {
    request({
        method: 'GET',
        url: 'https://www.yugioh-card.com/de/limited/'
    }, (err, res, body) => {
        if (err) return console.error(err);

        let $ = cheerio.load(body);

        currentDate = $('h2:contains("Gültig")').text();
        if (currentDate !== oldDate) {
            console.log("There is a new banlist!");
        } else {
            console.log("There is no new banlist");
        }
    });
}, 600);


app.get('/banlist', (req, res) => {
    res.send("<html><body><div>" + result + "</div></body></html>")
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})