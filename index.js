const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

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

let mailOptions = {
    from: 'ygobanlistchecker@gmail.com',
    to: 'Dominik.Kesim@gmail.com',
    subject: 'Banlist update',
    text: 'Banlist has not been updated.'
}

const app = express();

let requestLoop = setInterval(() => {
    request({
        method: 'GET',
        url: url
    }, (err, res, body) => {
        if (err) return console.error(err);

        let $ = cheerio.load(body);

        currentDate = $('h2:contains("Gültig")').text();
        if (currentDate !== oldDate) {
            console.log("There is a new banlist!");
            
            result = currentDate;
            let mailOptions = {
                from: 'ygobanlistchecker@gmail.com',
                // P.staneker@freenet.de, Paul.Astfalk@gmx.net
                to: 'Dominik.Kesim@gmail.com, P.staneker@freenet.de, Paul.Astfalk@gmx.net, Steffen.ulitzsch@gmx.de, Dieter.daniel.j@gmail.com, biggie1893@outlook.de, M.wornath@gmx.de',
                subject: 'Banlist update',
                text: 'Die Liste für Verbotene und Limitierte Karten wurde aktualisiert.' 
                + ' Die neue Liste ist'  + result
            }
            
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
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