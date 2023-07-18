const bunyan = require('bunyan');
const ElasticsearchStream = require('bunyan-elasticsearch');

// Configure the Elasticsearch stream
const esStream = new ElasticsearchStream({
  indexPattern: '[logstash-]YYYY.MM.DD',
  type: '_doc',
  host: 'localhost:9200' // Replace with your Elasticsearch instance host
});

esStream.on('error', function (err) {
  console.log('Elasticsearch Stream Error:', err.stack);
});

// Create the logger
const logger = bunyan.createLogger({
  name: 'myapp',
  streams: [
    { stream: process.stdout },
    { stream: esStream }
  ],
  serializers: bunyan.stdSerializers
});

// Log some messages
logger.info('hi');
logger.warn({lang: 'fr'}, 'au revoir');
