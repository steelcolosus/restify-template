import { userService } from './../services/users';
import { BaseController } from './baseController';
import { Request, Response } from 'restify';
import { path, GET, POST, PUT, DELETE } from '../core/decorators';
import { Authenticate } from '../core/decorators/authenticate';

@path('/users')
@Authenticate
class UserController extends BaseController {

    @GET
    async list(req: Request, res: Response): Promise<void> {
        res.send(await userService.list());
    }

    @GET('/:id')
    async getById(req: Request, res: Response): Promise<void> {
        const customer = await userService.getById(req.params.id);
        res.send(customer ? 200 : 404, customer);
    }

    @POST
    async create(req: Request, res: Response): Promise<void> {

        res.send(await userService.save(req.body));
    }

    @PUT('/:id')
    async update(req: Request, res: Response): Promise<void> {
        res.send(await userService.update({ ...req.body, id: +req.params.id }));
    }

    @DELETE('/:id')
    async remove(req: Request, res: Response): Promise<void> {
        try {
            const result = await userService.delete(req.params.id);
            if (result) res.send(200);
            else res.send(404);
        }
        catch (e) {
            res.send(500);
        }
    }
}

export const userController = new UserController();