import { Request, Response } from 'restify';
import { AllowMethod } from '../core/utils/decorators/allowAny';
export abstract class BaseController {

    protected allowed: AllowMethod[] = [];

    abstract async list(req: Request, res: Response): Promise<void>;

    abstract async getById(req: Request, res: Response): Promise<void>;

    abstract async create(req: Request, res: Response): Promise<void>;

    abstract async update(req: Request, res: Response): Promise<void>;

    abstract async remove(req: Request, res: Response): Promise<void>;
}
