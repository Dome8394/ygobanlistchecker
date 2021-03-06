const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const DOMParser = require('dom-parser');
const path = require('path');

const connection = require('./config/db');
const email = require('./routes/Email');
const index = require('./routes/Index');

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
        pass: ''
    }
})

const app = express();
// (async () => await connection())();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use('/add/newsletter', email);
// app.use('/', index);

app.use(express.json());

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

        } else {
            console.log("There is no new banlist");
        }

    });
}, 300000);



app.get('/', (req, res) => {
    
    const forbidden = [];
    const limited = [];
    const semiLimited = [];
    const unlimited = [];
    
    request({ method: 'GET', url: url }, (error, response, body) => {

        if (error) {
            res.render('error', {
                error_msg: error
            });
        }

        let $ = cheerio.load(body);
        currentDate = $('h2:contains("Gültig")').text();
        
        let script = $('script[type=text/javascript]').html();

        eval(script);

        const forbiddenCards = Object.values(jsonData[0]).filter(content => content.hasOwnProperty('prev'));
        const limitedCards = Object.values(jsonData[1]).filter(content => content.hasOwnProperty('prev'));
        const unlimitedCards = Object.values(jsonData[3]).filter(content => content.hasOwnProperty('prev'));
        const semiLimitedCards = Object.values(jsonData[2]).filter(content => content.hasOwnProperty('prev'));


        forbiddenCards.forEach((val, idx) => {

            const entry = {
                "name": val.nameeng,
                "prev": val.prev
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
        
        res.render('index', {
            current_banlist_date: currentDate,
            forbidden: forbidden,
            limited: limited,
            semiLimited: semiLimited,
            unlimited: unlimited
        });

    });

});

app.listen(port, host, () => {
    console.log(`App listening at http://localhost:${port}`);
})
