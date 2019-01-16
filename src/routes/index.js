const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index'); // res.send para enviar texto, res.render para enviar archivos
});

router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;
