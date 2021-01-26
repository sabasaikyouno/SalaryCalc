'use strict';
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('salaryhome', {title: 'home'});
});

module.exports = router;