import {
  DataStoredInToken,
  RequestWithContext,
} from "@/common/interfaces/auth.interface";
import { JwtConfig } from "@/config";
import { UserEntity } from "@/entities/user.entity";
import { ErrorMessage } from "@/exceptions/ErrorMessage";
import { logger } from "@/utils/logger.util";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { isNil } from "lodash";
import { UnauthorizedError } from "routing-controllers";

const AuthMiddleware = async (
  req: RequestWithContext,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization").split("Bearer ")[1]
        : null);

    if (isNil(token)) {
      logger.error("Empty JWT.");
      throw new UnauthorizedError(ErrorMessage.Guard_RequiredJWT);
    }

    const secretKey: string = JwtConfig.JWT_SECRET;
    const userContext = (await verify(token, secretKey)) as DataStoredInToken;
    const userResource = await UserEntity.findOne(userContext.id, {
      select: ["id", "email", "address", "solana", "uid", "chainId", "role"],
    });

    if (isNil(userResource)) {
      logger.error(`Resource Not Found: ${token}`);
      throw new UnauthorizedError(ErrorMessage.Guard_MalformedJWT);
    }

    req.context = { user: userResource };
    next();
  } catch (error) {
    next(error);
  }
};

export default AuthMiddleware;
