const express = require('express')
const router = express.Router();

router.post('/upload', (req, res) => {
   req.container.resolve('uploadApi').handleRequest(req, res);
});

module.exports = router;