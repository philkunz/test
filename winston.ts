import winston from 'winston';
import ElasticsearchTransport from 'winston-elasticsearch';

const esTransportOpts: winston_elasticsearch.ElasticsearchTransportOptions = {
  level: 'info',
  clientOpts: {
    node: 'http://localhost:9200', // replace with your Elasticsearch instance host
  },
};

const logger: winston.Logger = winston.createLogger({
  transports: [
    new ElasticsearchTransport(esTransportOpts),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Log some messages
logger.info('Informational message');
logger.error('Error message', { error: new Error('An error occurred') });
