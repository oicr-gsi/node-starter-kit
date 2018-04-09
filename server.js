'use strict';

require('dotenv').config();
const express = require('express'); // Express server
const logger = require('./utils/logger'); // Logging
const prom = require('./utils/prometheus'); // Prometheus monitoring
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));

// generate a UID for each request and log it
app.use((req, res, next) => {
  if (!req.uid) req.uid = uuidv4();
  res.uid = req.uid;
  logger.info({
    uid: req.uid,
    method: req.method,
    url: req.originalUrl,
    origin: req.connection.remoteAddress
  });
  next();
});

// add request handlers here

// error handling goes second-last

// metrics go last
app.use((req, res, next) => {
  const responseTimeInMs = Date.now - Date.parse(req._startTime);
  const path = req.route ? req.route.path : req.originalUrl;
  prom.httpRequestDurationMiiliseconds.labels(path).observe(responseTimeInMs);
  prom.httpRequestCounter.labels(path, req.method, res.statusCode).inc();
  next();
});

// export the server for testing
module.exports = app;

// Start the server and listen on port
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  const host = server.address().address;
  const port = server.address().port;

  logger.info(`Listening at http://${host}:${port}`);
});
