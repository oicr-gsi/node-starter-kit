'use strict';

const prometheus = require('prom-client');

// Prometheus monitoring
prometheus.collectDefaultMetrics();
const httpRequestDurationMilliseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

const httpRequestCounter = new prometheus.Counter({
  name: 'http_request_counter',
  help: 'Number of requests for this endpoint',
  labelNames: ['route', 'method', 'status']
});

module.exports = {
  httpRequestDurationMilliseconds: httpRequestDurationMilliseconds,
  httpRequestCounter: httpRequestCounter,
  prometheus: prometheus
};
