import { Request, Response } from 'restify';
import { path, POST } from '../utils';
import { authenticationService } from '../services/authentication';

import { appPropertyConfig, PropertyConfig } from '../config';

@path('/auth')
class AuthenticationController {
  jwt = require('jsonwebtoken');

  constructor(public config: PropertyConfig) {}

  @POST
  async authenticate(req: Request, res: Response): Promise<void> {
    const user = await authenticationService.authenticate(req.body);

    if (user) {
      let token = this.jwt.sign(
        { user: user.username },
        this.config.jwt.secret,
        {
          expiresIn: '10m',
          algorithm: 'HS256'
        }
      );
      let { iat, exp } = this.jwt.decode(token);
      res.send({ iat, exp, token });
    } else {
      res.send(401, 'Unauthorized');
    }
  }
}

export const authController = new AuthenticationController(appPropertyConfig);
