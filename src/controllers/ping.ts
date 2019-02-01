
import { Request, Response } from 'restify';
import { path, GET } from "../utils";

@path('/ping')
class PingController {

    @GET
    private async ping(req: Request, res: Response): Promise<void> {
        res.send(200, 'hello');
    }
}

export const pingController = new PingController()