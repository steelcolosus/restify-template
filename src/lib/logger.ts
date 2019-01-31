import { LoggingConfig } from './../config/index';
import * as winston from 'winston';

const { createLogger, format, transports } = winston;
const {
  combine,
  timestamp,
  label,
  prettyPrint,
  colorize,
  align,
  printf
} = format;

const createTransports = function(config) {
  const customTransports = [];

  if (config.file) {
    // setup the log transport
    customTransports.push(
      new transports.File({
        filename: config.file,
        level: config.level,
        format: combine(
          label({ label: 'Restify API' }),
          timestamp(),
          align(),
          printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
        ),
        maxsize:5024,
        maxFiles: 5,
        tailable:true
      })
    );
  }

  // if config.console is set to true, a console logger will be included.
  if (config.console) {
    customTransports.push(
      new transports.Console({
        level: config.level,
        format: combine(
          colorize(),
          label({ label: 'Restify API' }),
          timestamp(),
          align(),
          printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
        )
      })
    );
  }

  return customTransports;
};

export default {
  create: function(config: LoggingConfig): winston.Logger {
    return createLogger({
      transports: createTransports(config)
    });
  }
};
