import { customerService } from "../services/customer";
import { Request, Response } from 'restify';
import { BaseController } from "./baseController";
import { path, GET, POST, PUT, DELETE } from "../utils";

@path('/customers')
export class CustomerController extends BaseController {
    
    @GET
    async list(req: Request, res: Response): Promise<void> {
        res.send(await customerService.list());
    }

    @GET('/:id')
    async getById(req: Request, res: Response): Promise<void> {
        const customer = await customerService.getById(req.params.id);
        res.send(customer ? 200 : 404, customer);
    }

    @POST
    async create(req: Request, res: Response): Promise<void> {

        res.send(await customerService.save(req.body));
    }

    @PUT('/:id')
    async update(req: Request, res: Response): Promise<void> {
        res.send(await customerService.update({ ...req.body, id: +req.params.id }));
    }

    @DELETE('/:id')
    async remove(req: Request, res: Response): Promise<void> {
        try {
            const result = await customerService.delete(req.params.id);
            if (result) res.send(200);
            else res.send(404);
        }
        catch (e) {
            res.send(500);
        }
    }

}