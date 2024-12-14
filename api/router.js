const express = require('express')
const router = express.Router();

router.post('/upload', (req, res) => {
   req.container.resolve('uploadApi').handleRequest(req, res);
});

router.post('/trim', (req, res) => {
   req.container.resolve('trimApi').handleRequest(req, res);
});

router.post('/stich', (req, res) => {
   req.container.resolve('stichApi').handleRequest(req, res);
});

router.get('/link', (req, res) => {
   req.container.resolve('linkApi').handleRequest(req, res);
});

module.exports = router;