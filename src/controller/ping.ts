import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";

export class PingController implements Controller {
    initialize(httpServer: HttpServer): void {
        httpServer.get('/ping', (req, res) => res.send(200, 'hello'));
    }
}