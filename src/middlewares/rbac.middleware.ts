import { RequestHandler } from 'express';
import { isEmpty, isNil } from 'lodash';
import { ForbiddenError, InternalServerError } from 'routing-controllers';

import { RequestWithContext, RoleEnum } from '@/common/interfaces/auth.interface';
import { ErrorMessage } from '@/exceptions/ErrorMessage';

const RoleMiddleware = (requiredRoles: RoleEnum[] = []): RequestHandler => {
  return (req: RequestWithContext, res, next) => {
    try {
      const { context } = req;

      if (isNil(context)) {
        throw new InternalServerError(ErrorMessage.Role_RequiredAuth);
      }

      const { user } = context;

      if (!isEmpty(requiredRoles) && !requiredRoles.includes(user.role)) {
        throw new ForbiddenError(ErrorMessage.Role_AccessForbidden);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default RoleMiddleware;
