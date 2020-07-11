import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Token não enviado!');
  }

  try {
    const [scheme, token] = authHeader.split(' ');

    if (!/^Bearer$/i.test(scheme)) {
      throw new Error('Token não compatível!');
    }

    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new Error('Token mal formado!');
  }
}
