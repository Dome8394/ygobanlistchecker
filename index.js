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

        forbiddenCards.forEach((val, idx) => {

            const entry = {
                "name": val.nameeng,
                "Previously at": val.prev
            }

            forbidden.push(entry);
        });

        limitedCards.forEach((val, idx) => {

            const entry = {
                "name": val.nameeng,
                "prev": val.prev
            }

            limited.push(entry);
        });

        unlimitedCards.forEach((val, idx) => {

            const entry = {
                "name": val.nameeng,
                "prev": val.prev
            }

            unlimited.push(entry);
        });

        semiLimitedCards.forEach((val, idx) => {

            const entry = {
                "name": val.nameeng,
                "prev": val.prev
            }

            semiLimited.push(entry);
        });
        
        console.log(forbidden);

        currentDate = $('h2:contains("Gültig")').text();
        if (currentDate !== oldDate) {
            console.log("There is a new banlist!");

            result = currentDate;

            let mailOptions = {
                from: 'ygobanlistchecker@gmail.com',
                to: 'Dominik.Kesim@gmail.com, P.staneker@freenet.de, Paul.Astfalk@gmx.net, Steffen.ulitzsch@gmx.de, Dieter.daniel.j@gmail.com, biggie1893@outlook.de,'
                 + 'M.wornath@gmx.de, robin.bauz@gmail.com, neufferchristoph@yahoo.de',
                subject: 'Banlist update',
                text: 'Die Liste für Verbotene und Limitierte Karten wurde aktualisiert. Die Liste ist ' + result
                    + '. Link: ' + url + "\n"
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error while sending mail...', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

        } else {
            console.log("There is no new banlist");
        }

    });
}, 300000);

app.get('/', (req, res) => {
    res.send("<html><body><div><h1>" + result + "</h1></div></body></html>")
})

app.listen(port, host, () => {
    console.log(`App listening at http://localhost:${port}`);
})