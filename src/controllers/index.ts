import { authController } from './authentication';

import { userController } from './user';

import { pingController } from './ping';

export const CONTROLLERS: any = [
  authController,
  userController,
  pingController
];
