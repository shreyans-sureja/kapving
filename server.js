const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./api/router');
const bodyParser = require('body-parser');

const server = (container) => {
    return new Promise((resolve, reject) => {
       const app = express();
       app.use(morgan('dev'));
       app.use(helmet());
       app.use(cors());
       // app.use(bodyParser.urlencoded({extended : true}));
       // app.use(bodyParser.json());

       app.get('/', (req, res) => {
          res.send("Hello from kapving");
       });

       app.use((req, res, next) => {
          req.container = container.createScope();
          next();
       });

       app.use('/kapving/v1', router);
       return resolve(app);
    });
}

module.exports = server;