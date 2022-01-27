const express = require('express');
const router = express.Router();

const index_controller = require('../controllers/IndexController');

router.get('/', index_controller.landing_page);