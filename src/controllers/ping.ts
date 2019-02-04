
import { Request, Response } from 'restify';
import { path, GET } from "../utils";
import { AllowAny } from '../utils/decorators/allowAny';

@path('/ping')
class PingController {
    @AllowAny()
    @GET
    private async ping(req: Request, res: Response): Promise<void> {
        res.send(200, 'hello');
    }
}

export const pingController = new PingController()