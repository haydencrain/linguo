import client from './src/client';
import config from './config';
import helpers from './src/utils/helpers';
import raven from 'raven';

// Check that node version is the required node version
if (process.version.slice(1).split('.')[0] < 8)
  throw new Error('Node 8.0.0 or higher is required. Please update Node on your system');

if (!helpers.isDevelopment()) {
  raven.config('https://10f30fa174bc42aeb4d26249f8cd89a8@sentry.io/1197471', {
    captureUnhandledRejections: true
  }).install();
}

client.start(config);
