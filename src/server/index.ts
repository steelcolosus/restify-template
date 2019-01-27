import { RequestHandler } from 'restify';
import * as restify from 'restify';
import { Server } from 'restify';
import { resource as accessResource, resource } from '../utils/access';
import * as path from 'path';
import { DatabaseProvider, DatabaseConfiguration } from '../database';

export class ApiServer {
  private restify: Server;
  private handlers: restify.RequestHandlerType[];
  private controllers: any[];
  private bodyParser: boolean;
  private queryParser: boolean;
  private port: number;
  private dbConfig: DatabaseConfiguration;
  private httpToRestify = {
    HEAD: 'head',
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'del'
  };

  constructor(build) {
    this.dbConfig = build.dbConfig;
    if (!this.dbConfig) {
      throw new Error('Database not configured');
    }

    DatabaseProvider.configure(this.dbConfig);

    this.restify = restify.createServer();

    this.handlers = build.handlers;

    if (this.handlers !== undefined && this.handlers.length > 0) {
      this.restify.use(...this.handlers);
    }
    this.bodyParser = build.bodyParser;
    if (this.bodyParser) {
      this.restify.use(restify.plugins.bodyParser());
    } else {
      console.log('you are not using any body parser');
    }
    this.queryParser = build.queryParser;
    if (this.queryParser) {
      this.restify.use(restify.plugins.queryParser());
    } else {
      console.log('you are not using any qjery parser');
    }

    this.controllers = build.controllers;

    if (this.controllers == undefined || this.controllers.length == 0) {
      console.log('No controllers detected');
    } else {
      this.controllers.forEach(resource => {
        const { endpoints, basePath } = accessResource(resource.constructor);
        endpoints.forEach(endpoint => {
          const { http, methodName, methodPath } = endpoint;
          const completePath = path
            .join(basePath, methodPath || '')
            .replace(/\\/g, '/');
          const verb = this.httpToRestify[http];
          const endpointMethod = resource[methodName];
          this.addRoute(verb, completePath, endpointMethod.bind(resource));
        });
      });
    }

    this.port = build.port;

    this.restify.listen(this.port, () =>
      console.log(`server is up and running on port ${this.port}`)
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
        console.log(e);
        res.send(500, e);
      }
    });
    console.log(`Added route ${method.toUpperCase()}: ${url}`);
  }

  static get Builder() {
    class Builder {
      private port: number;
      private bodyParser: boolean;
      private queryParser: boolean;
      private controllers: any[];
      private handlers: restify.RequestHandlerType[];
      private dbConfig: DatabaseConfiguration;
      constructor(port: number) {
        this.port = port;
      }

      withBodyParser() {
        this.bodyParser = true;
        return this;
      }
      withQueryParser() {
        this.queryParser = true;
        return this;
      }
      withResources(...resources: any[]) {
        this.controllers = resources;
        return this;
      }
      withExtraHandlers(...requestHandlers: restify.RequestHandlerType[]) {
        this.handlers = requestHandlers;
        return this;
      }

      withDBConfig(config: DatabaseConfiguration) {
        this.dbConfig = config;
        return this;
      }

      build() {
        return new ApiServer(this);
      }
    }
    return Builder;
  }
}
