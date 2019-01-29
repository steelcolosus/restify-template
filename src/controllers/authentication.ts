import { BaseController } from './baseController';
import { Request, Response } from 'restify';
import { path, GET, POST, PUT, DELETE } from "../utils";
import { authenticationService } from '../services/authentication';

@path('/auth')
export class AuthenticationController  {
    
    config = require('../utils/config');
    jwt = require('jsonwebtoken');

    @POST
    async authenticate(req: Request, res: Response): Promise<void> {

        const user = await authenticationService.authenticate(req.body);
        
        if(user){
            let token = this.jwt.sign({user:user.username}, this.config.jwt.secret,{
                expiresIn: '10m',
                algorithm: 'HS256'
              });
            let {iat, exp} = this.jwt.decode(token);
            res.send({iat,exp,token});
        }        
    }


}
