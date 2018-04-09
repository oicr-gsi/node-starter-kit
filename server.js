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

app.use((req, res, next) => {
  // manually set a start time because Express seems to change this with each version
  req._startTime = new Date();
  // generate a UID for each request and log it
  if (!req.uid) req.uid = uuidv4();
  res.uid = req.uid;
  logger.info({
    startTime: req._startTime,
    uid: req.uid,
    method: req.method,
    url: req.originalUrl,
    origin: req.connection.remoteAddress
  });
  next();
});

// add request handlers here

// error handling goes second-last, and is noted by the `err` argument which comes first
// this is one pattern, but others would work too
app.use((err, req, re, next) => {
  if (res.headersSent) {
    logger.error({
      message:
        'Headers sent before error handler invoked for err ' +
        (err.message ? err.message : ' with no message'),
      uid: req.uid
    });
    return next();
  }
  if (!err.status) {
    // error hasn't been assigned a status code where it was thrown, so it may be an unexpected error
    logger.error({
      uid: req.uid,
      message: err.message ? err.message : 'error has no message'
    });
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
  res.end();
  next();
});

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
