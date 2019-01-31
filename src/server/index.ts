import { PropertyConfig } from './../config/index';
import { RequestHandler } from 'restify';
import * as restify from 'restify';
import { Server } from 'restify';
import * as path from 'path';
import { DatabaseProvider } from '../database';
import { CONTROLLERS } from '../controllers';
import { jsend, log } from '../lib';
import * as corsMiddleware from 'restify-cors-middleware';


export class ApiServer {
  private restify: Server;

  constructor(config: PropertyConfig) {
    if (!config.db) {
        log.error(new Error('Database not configured'));
      ;
    }

    DatabaseProvider.configure(config.db);

    this.restify = restify.createServer({
      name: config.app.name,
      formatters: {
        'application/json': jsend
      }
    });

    if (config.cors) {
      const cors = corsMiddleware(config.cors);
      this.restify.pre(cors.preflight);
      this.restify.use(cors.actual);
    }

    if (config.jwt) {
      const rjwt = require('restify-jwt-community');
      this.restify.use(
        rjwt(config.jwt).unless({
          path: [
            config.app.globalPath + '/auth',
            config.app.globalPath + '/users',
            config.app.globalPath + '/ping'
          ]
        })
      );
    }

    //this.restify.use(restify.plugins.bodyParser());
    this.restify.pre(restify.pre.sanitizePath());
    this.restify.use(restify.plugins.acceptParser(this.restify.acceptable));
    this.restify.use(restify.plugins.queryParser());

    this.restify.use(
      restify.plugins.bodyParser({
        mapParams: false
      })
    );

    if (CONTROLLERS == undefined || CONTROLLERS.length == 0) {
      log.error(new Error('No controllers detected'));
    } else {
      CONTROLLERS.forEach(resource => {
        const { endpoints, basePath } = resource;
        endpoints.forEach(endpoint => {
          const { http, methodName, methodPath } = endpoint;
          const completePath = path
            .join(config.app.globalPath || '', basePath, methodPath || '')
            .replace(/\\/g, '/');

          log.info(`Added route ${http.toUpperCase()}: ${completePath}`);
          const endpointMethod = resource[methodName];
          this.addRoute(http, completePath, endpointMethod.bind(resource));
        });
      });
    }
    this.restify.listen(config.app.port, () =>
      log.info(
        `${config.app.name} Server is running on port - ${config.app.port}`
      )
    );
  }

  private addRoute(
    method: 'get' | 'post' | 'put' | 'del',
    url: string,
    requestHandler: restify.RequestHandler
  ): void {
    this.restify[method](url, async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      } catch (e) {
        log.error(e);
        res.send(500, e);
      }
    });
  }
}
