
import { Request, Response } from 'restify';
import { AllowAny } from '../core/utils/decorators/allowAny';
import { path, GET } from '../core/utils';

@path('/ping')
class PingController {
    @AllowAny()
    @GET
    private async ping(req: Request, res: Response): Promise<void> {
        res.send(200, 'hello');
    }
}

export const pingController = new PingController()