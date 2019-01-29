import { RequestHandler } from 'restify';
import * as restify from 'restify';
import { Server } from 'restify';
import * as path from 'path';
import { DatabaseProvider, DatabaseConfiguration } from '../database';
import { server } from 'spdy';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD'
}

export interface CorsConfiguration {
  preflightMaxAge?: number; // Optional
  origins: any[];
  allowMethods: HttpMethod[];
  allowHeaders: string[];
  exposeHeaders: string[];
}

export class ApiServer {
  private restify: Server;
  private handlers: restify.RequestHandlerType[] = [];
  private preHandlers: restify.RequestHandlerType[] = [];
  private controllers: any[];
  private bodyParser: boolean;
  private queryParser: boolean;
  private port: number;
  private dbConfig: DatabaseConfiguration;
  private corsConfig: CorsConfiguration;
  private globalPath: string;

  constructor(build) {
    this.dbConfig = build.dbConfig;
    if (!this.dbConfig) {
      throw new Error('Database not configured');
    }

    DatabaseProvider.configure(this.dbConfig);

    this.restify = restify.createServer();

    this.handlers = build.handlers;

    if (this.corsConfig) {
      const corsMiddleware = require('restify-cors-middleware');
      const cors = corsMiddleware(this.corsConfig);
      this.restify.pre(cors.pref);
      this.restify.use(cors.actual);
    }

    if (this.handlers !== undefined && this.preHandlers.length > 0) {
      this.restify.pre(...this.preHandlers);
    }

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
    this.globalPath = build.globalPath;

    if (this.controllers == undefined || this.controllers.length == 0) {
      console.log('No controllers detected');
    } else {
      this.controllers.forEach(resource => {
        const { endpoints, basePath } = resource;
        endpoints.forEach(endpoint => {
          const { http, methodName, methodPath } = endpoint;
          const completePath = path
            .join(this.globalPath || '', basePath, methodPath || '')
            .replace(/\\/g, '/');

          console.log(`Added route ${http.toUpperCase()}: ${completePath}`);
          const endpointMethod = resource[methodName];
          this.addRoute(http, completePath, endpointMethod.bind(resource));
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
  }

  static get Builder() {
    class Builder {
      private port: number;
      private bodyParser: boolean;
      private queryParser: boolean;
      private controllers: any[];
      private handlers: restify.RequestHandlerType[];
      private preHandlers: restify.RequestHandlerType[];
      private dbConfig: DatabaseConfiguration;
      private corsConfig: CorsConfiguration;
      private globalPath: string;

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
      use(...requestHandlers: restify.RequestHandlerType[]) {
        this.handlers.push(...requestHandlers);
        return this;
      }
      pre(...requestHandlers: restify.RequestHandlerType[]) {
        this.preHandlers.push(...requestHandlers);
        return this;
      }

      withDBConfig(config: DatabaseConfiguration) {
        this.dbConfig = config;
        return this;
      }

      withCORS(corsConfig: CorsConfiguration) {
        this.corsConfig = corsConfig;
        return this;
      }

      withGlobalPath(path: string) {
        this.globalPath = path;
        return this;
      }

      build() {
        return new ApiServer(this);
      }
    }
    return Builder;
  }
}
