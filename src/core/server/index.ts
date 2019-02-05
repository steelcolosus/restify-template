import { PropertyConfig } from './../config/index';
import * as restify from 'restify';
import { Server } from 'restify';
import * as path from 'path';
import { jsend, logger } from '../lib';
import * as corsMiddleware from 'restify-cors-middleware';
import { CONTROLLERS } from '../../controllers';
import { DatabaseProvider } from '../../data/database';
const chalk = require("chalk");

export class ApiServer {
    private restify: Server;
    private allowedRoutes: string[] = [];

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
        this.jwtAuthentication();
        this.restify.listen(this.config.app.port, () =>
            logger.info(
                `${chalk.yellow(this.config.app.name)} Server is running on port - ${chalk.green(this.config.app.port)}`
            )
        );
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
        this.restify.on('uncaughtException', (req, res, route, err) => {
            logger.error(err.stack);
            res.send(err);
        });

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
            const rjwt = require('restify-jwt-community');
            this.restify.use(
                rjwt(this.config.jwt).unless({
                    path: this.allowedRoutes ? this.allowedRoutes : []
                })
            );
        } else {
            logger.error('no JWT configuration found')
        }
    }

    private registerResources(...controllers) {
        if (controllers == undefined || controllers.length == 0) {
            const message = 'No controllers detected'
            logger.error(message);
            throw new Error(message);

        } else {
            controllers.forEach(resource => {
                logger.info(chalk.green(`Registering controller: ${chalk.yellow(resource.constructor.name)}`))
                const { endpoints, basePath, allowed } = resource;
                endpoints.forEach(endpoint => {
                    const { http, methodName, methodPath } = endpoint;
                    const completePath = path
                        .join(this.config.app.globalPath || '', basePath || '/', methodPath || '')
                        .replace(/\\/g, '/');
                    logger.info(chalk.cyan(`\tAdded route ${http.toUpperCase()}: ${completePath}`));
                    const endpointMethod = resource[methodName];
                    this.addRoute(http, completePath, endpointMethod.bind(resource));

                    if (allowed) {
                        const allowedMethod = allowed.find(x => x.methodName == methodName);
                        if (allowedMethod && allowedMethod.allow) {
                            this.allowedRoutes.push(completePath);
                        }
                    }

                });
            });
        }
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
                logger.error(e);
                res.send(500, e);
            }
        });
    }
}
