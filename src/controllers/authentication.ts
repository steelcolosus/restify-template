import { Request, Response } from 'restify';
import { AuthenticationService, authService } from '../services/authentication';
import { PropertyConfig, appPropertyConfig } from '../core/config';
import { POST } from '../core/decorators';

class AuthenticationController {
    jwt = require('jsonwebtoken');

    constructor(
        public config: PropertyConfig,
        public service: AuthenticationService
    ) { }


    @POST('/auth')
    async authenticate(req: Request, res: Response): Promise<void> {

        const user = await this.service.authenticate(req.body);
        if (user) {
            let token = this.jwt.sign(
                { id: user.id, user: user.username },
                this.config.jwt.secret,
                {
                    expiresIn: this.config.jwt.expiration,
                    algorithm: 'HS256'
                }
            );
            let { iat, exp } = this.jwt.decode(token);
            res.send({ iat, exp, token });
        } else {
            res.send(401, 'Unauthorized');
        }
    }


    @POST('/register')
    async register(req: Request, res: Response): Promise<void> {
        const user = await this.service.register(req.body)

        if (user) {
            const { id, firstName, lastName, username } = user;
            res.send({ id, firstName, lastName, username })
        } else {
            res.send(403, `User ${req.body.username} already exists`)
        }

    }


}

export const authController = new AuthenticationController(appPropertyConfig, authService);
