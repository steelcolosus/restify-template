import { HttpServer } from "./httpServer";
import * as restify from 'restify';
import { Server } from 'restify';
import { CONTROLLERS } from "../controller";
import { resource as accessResource, resource } from '../utils/access';
import * as path from 'path';



export class ApiServer implements HttpServer {
    private restify: Server;
    httpToRestify = {
        HEAD: 'head',
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'del'
    };
    get(url: string, requestHandler: restify.RequestHandler): void {
        this.addRoute('get', url, requestHandler);
    }
    post(url: string, requestHandler: restify.RequestHandler): void {
        this.addRoute('post', url, requestHandler);
    }
    put(url: string, requestHandler: restify.RequestHandler): void {
        this.addRoute('put', url, requestHandler);
    }
    del(url: string, requestHandler: restify.RequestHandler): void {
        this.addRoute('del', url, requestHandler);
    }

    private addRoute(method: 'get' | 'post' | 'put' | 'del', url: string, requestHandler: restify.RequestHandler): void {
        this.restify[method](url, async (req, res, next) => {
            try {
                await requestHandler(req, res, next);
            }
            catch (e) {
                console.log(e);
                res.send(500, e);
            }
        });
        console.log(`Added route ${method.toUpperCase()}: ${url}`);
    }

    public start(port: number): void {
        this.restify = restify.createServer();
        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.plugins.queryParser());

        //CONTROLLERS.forEach(controller => controller.initialize(this));
        CONTROLLERS.forEach((resource) => {
            const { endpoints, basePath } = accessResource(resource.constructor);
            endpoints.forEach((endpoint) => {
                const { http, methodName, methodPath, filters } = endpoint;

                const completePath = path.join(basePath, methodPath || '').replace(/\\/g, '/');
                const verb = this.httpToRestify[http];
                const endpointMethod = resource[methodName];
                this.addRoute(verb, completePath, endpointMethod.bind(resource))
            });
        });

        resource

        this.restify.listen(port, () => console.log(`server is up and running on port ${port}`));
    }

}