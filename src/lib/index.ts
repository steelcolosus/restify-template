import { appPropertyConfig } from './../config/config';
import formatJSend from './jsend';
import logger from './logger';
import winston = require('winston');

const log:winston.Logger = logger.create(appPropertyConfig.applicationLogging)


export { formatJSend as jsend,  log};
