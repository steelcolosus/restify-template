import { PropertyConfig } from './../config/index';
import * as restify from 'restify';
import { Server } from 'restify';
import * as path from 'path';
import { jsend, logger } from '../lib';
import * as corsMiddleware from 'restify-cors-middleware';
import { CONTROLLERS } from '../../controllers';
import { DatabaseProvider } from '../../core/database';
import * as rjwt from 'restify-jwt-community';

export class ApiServer {
    private restify: Server;

    constructor(public config: PropertyConfig) {
        this.restify = restify.createServer({
            name: config.app.name,
            formatters: {
                'application/json': jsend
            }
        });

        this.initDB();
        this.basicServerConfig();
        this.enableCors();

        this.registerResources(...CONTROLLERS)

        //this.serveStaticContent('.' + this.config.app.staticSourcesDir, '/images');


        this.restify.listen(this.config.app.port, () =>
            logger.info(
                `${this.config.app.name} Server is running on port - ${this.config.app.port}`
            )
        );
    }

    private serveStaticContent(directory, endpoint) {
        const completePath = path
            .join(this.config.app.globalPath || '', endpoint)
            .replace(/\\/g, '/');
        logger.info(`Registering static resources`);
        logger.info(`\tAdded route GET: ${completePath}`);
        this.addRoute('get', completePath + '/*', restify.plugins.serveStatic({
            directory: directory,
            appendRequestPath: false
        }));
    }

    private initDB() {
        if (!this.config.db) {
            logger.error(new Error('Database not configured'));
        }
        DatabaseProvider.configure(this.config.db);
    }

    private basicServerConfig() {
        this.restify.pre(restify.pre.sanitizePath());
        this.restify.use(restify.plugins.acceptParser(this.restify.acceptable));
        this.restify.use(restify.plugins.queryParser());
        this.restify.use(
            restify.plugins.bodyParser({
                mapParams: false
            })
        );
    }

    private enableCors() {
        if (this.config.cors) {
            const cors = corsMiddleware(this.config.cors);
            this.restify.pre(cors.preflight);
            this.restify.use(cors.actual);
        } else {
            logger.error('no cors configuration found');
        }
    }

    private jwtAuthentication() {
        if (this.config.jwt) {
            return true;
        } else {
            logger.error('no JWT configuration found')
            return false;
        }
    }

    private registerResources(...controllers) {
        if (controllers == undefined || controllers.length == 0) {
            const message = 'No controllers detected'
            logger.error(message);
            throw new Error(message);

        } else {
            controllers.forEach(resource => {

                const { endpoints, basePath, allowed, secure } = resource;
                if (secure) {
                    if (this.jwtAuthentication()) {
                        logger.info(`Registering controller: ${resource.constructor.name} [Authenticated]`)
                    } else {
                        logger.error('You need to configure JWT token before authenticate your controller')
                    }
                } else {
                    logger.info(`Registering controller: ${resource.constructor.name}`)
                }
                endpoints.forEach(endpoint => {

                    const { http, methodName, methodPath } = endpoint;

                    const completePath = path
                        .join(this.config.app.globalPath || '', basePath || '/', methodPath || '')
                        .replace(/\\/g, '/');

                    const endpointMethod = resource[methodName];

                    if (secure && this.jwtAuthentication()) {
                        if (allowed && allowed.length > 0) {
                            const allowedMethod = allowed.find(x => x.methodName == methodName);
                            if (allowedMethod && allowedMethod.allow) {
                                logger.info(`\tAdded route ${http.toUpperCase()}: ${completePath} [not secured]`);
                                this.addRoute(http, completePath, endpointMethod.bind(resource));
                            }
                        } else {
                            logger.info(`\tAdded route ${http.toUpperCase()}: ${completePath} [secured]`);
                            this.addRoute(http, completePath, endpointMethod.bind(resource), rjwt(this.config.jwt));

                        }
                    } else {
                        logger.info(`\tAdded route ${http.toUpperCase()}: ${completePath}`);
                        this.addRoute(http, completePath, endpointMethod.bind(resource));
                    }

                });
            });
        }
    }

    private addRoute(
        method: 'get' | 'post' | 'put' | 'del',
        url: string,
        requestHandler: restify.RequestHandler,
        ...extraHandlers: restify.RequestHandler[]
    ): void {
        if (extraHandlers && extraHandlers.length > 0) {
            this.restify[method](url, ...extraHandlers, async (req, res, next) => {
                try {
                    await requestHandler(req, res, next);
                } catch (e) {
                    logger.error(e);
                    res.send(500, e);
                }
            });
        } else {
            this.restify[method](url, async (req, res, next) => {
                try {
                    await requestHandler(req, res, next);
                } catch (e) {
                    logger.error(e);
                    res.send(500, e);
                }
            });
        }

    }
}
