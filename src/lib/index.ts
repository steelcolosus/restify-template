import { appPropertyConfig } from './../config/config';
import formatJSend from './jsend';
import winston = require('winston');
import customLogger from './customLogger';

const logger: winston.Logger = customLogger.create(appPropertyConfig.applicationLogging)


export { formatJSend as jsend, logger };
