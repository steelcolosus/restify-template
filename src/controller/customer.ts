import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { customerService } from "../services/customer";
import { Request, Response } from 'restify';

export class CustomerController implements Controller {

    initialize(httpServer: HttpServer): void {
        httpServer.get('/customers', this.list.bind(this));
        httpServer.get('/customers/:id', this.getById.bind(this));
        httpServer.post('/customers', this.create.bind(this));
        httpServer.put('/customers/:id', this.update.bind(this));
        httpServer.del('/customers/:id', this.remove.bind(this));

    }

    private async list(req: Request, res: Response): Promise<void> {
        res.send(await customerService.list());
    }
    private async getById(req: Request, res: Response): Promise<void> {
        const customer = await customerService.getById(req.params.id);
        res.send(customer ? 200 : 404, customer);
    }
    private async create(req: Request, res: Response): Promise<void> {
        res.send(await customerService.create(req.body));
    }
    private async update(req: Request, res: Response): Promise<void> {
        res.send(await customerService.update({ ...req.body, id: req.params.id }));
    }
    private async remove(req: Request, res: Response): Promise<void> {
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