const express = require('express');
const router = express.Router();

const request = require('request');
const cheerio = require('cheerio'); 
const nodemailer = require('nodemailer');

const email_controller = require('../controllers/EmailController');

/**
 * Email post route to add email to the database
 * @desc /add/newsletter
 * @data String email
 */
router.post('/add/newsletter', email_controller.add_email);

/**
 * Verification endpoint
 * @desc /email/verify:id
 * @data JWT token
 */
router.get('/email/verify/:id/:token', email_controller.verify_mail);

module.exports = router;