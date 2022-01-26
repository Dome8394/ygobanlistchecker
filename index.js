const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const DOMParser = require('dom-parser');
let parser = new DOMParser();

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

const forbidden = [];
const limited = [];
const semiLimited = [];
const unlimited = [];

let oldDate = "Gültig ab 01/10/2021";
let result;
let url = 'https://www.yugioh-card.com/de/limited/';


let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
        user: 'ygobanlistchecker@gmail.com',
        pass: 'xgzuwvzqbidjovwc'
    }
})

const app = express();

app.set('view engine', 'pug');

let requestLoop = setInterval(() => {
    request({
        method: 'GET',
        url: url
    }, (err, res, body) => {
        if (err) return console.error(err);

        let $ = cheerio.load(body);

        let script = $('script[type=text/javascript]').html();

        eval(script);

        const forbiddenCards = Object.values(jsonData[0]).filter(content => content.hasOwnProperty('prev'));
        const limitedCards = Object.values(jsonData[1]).filter(content => content.hasOwnProperty('prev'));
        const unlimitedCards = Object.values(jsonData[2]).filter(content => content.hasOwnProperty('prev'));
        const semiLimitedCards = Object.values(jsonData[3]).filter(content => content.hasOwnProperty('prev'));

        currentDate = $('h2:contains("Gültig")').text();
        result = currentDate;
        
        console.log(currentDate);
        if (currentDate !== oldDate) {
            console.log("There is a new banlist!");

            forbiddenCards.forEach((val, idx) => {

                const entry = {
                    "name": val.nameeng,
                    "Previously at": val.prev
                }

                if (forbidden.length > 0) {
                    forbidden.forEach((value, idx) => {
                        if (!Object.values(value).includes(val.nameeng)) {
                            forbidden.push(entry);
                        }
                    })
                } else {
                    forbidden.push(entry);
                }

            });

            limitedCards.forEach((val, idx) => {

                const entry = {
                    "name": val.nameeng,
                    "prev": val.prev
                }

                if (limited.length > 0) {
                    limited.forEach((value, idx) => {
                        if (!Object.values(value).includes(val.nameeng)) {
                            limited.push(entry);
                        }
                    })
                } else {
                    limited.push(entry);
                }

            });

            unlimitedCards.forEach((val, idx) => {

                const entry = {
                    "name": val.nameeng,
                    "prev": val.prev
                }

                if (unlimited.length > 0) {
                    unlimited.forEach((value, idx) => {
                        if (!Object.values(value).includes(val.nameeng)) {
                            unlimited.push(entry);
                        }
                    })
                } else {
                    unlimited.push(entry);
                }

            });

            semiLimitedCards.forEach((val, idx) => {

                const entry = {
                    "name": val.nameeng,
                    "prev": val.prev
                }

                if (semiLimited.length > 0) {
                    semiLimited.forEach((value, idx) => {
                        if (!Object.values(value).includes(val.nameeng)) {
                            semiLimited.push(entry);
                        }
                    })
                } else {
                    semiLimited.push(entry);
                }
            });

            result = currentDate;

            let mailOptions = {
                from: 'ygobanlistchecker@gmail.com',
                to: 'Dominik.Kesim@gmail.com, P.staneker@freenet.de, neufferchristoph@yahoo.de, M.Wornath@gmx.de,' 
                +  'robin.bauz@gmail.com, steffen.ulitzsch@gmx.de, Dieter.daniel.j@gmail.com, Paul.Astfalk@gmx.net, biggie1893@outlook.de',
                subject: 'Banlist update',
                text: 'Die Liste für Verbotene und Limitierte Karten wurde aktualisiert. Die Liste ist ' + result
                    + '. Link: ' + url + "\n"
                    + "VERBOTEN" + "\n" + JSON.stringify(forbidden, null, 2) + "\n" + "LIMITIERT" + "\n" + JSON.stringify(limited, null, 2) + "\n"
                    + "SEMI-LIMITIERT" + "\n" + JSON.stringify(semiLimited, null, 2) + "\n"
                    + "NICHT LÄNGER AUF DER LISTE" + "\n" + JSON.stringify(unlimited, null, 2)
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error while sending mail...', error);
                } else {
                    console.log('Email sent: ' + info.response);
                    forbidden = [];
                    limited = [];
                    unlimited = [];
                    semiLimited = [];
                }
            });

        } else {
            console.log("There is no new banlist");
        }

    });
}, 300000);



app.get('/', (req, res) => {
    console.log(result);
    res.render('index', {
        title: 'Hello pug!'
    });
});

app.listen(port, host, () => {
    console.log(`App listening at http://localhost:${port}`);
})