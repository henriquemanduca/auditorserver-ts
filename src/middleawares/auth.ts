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
): Response {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Tokene não enviado!' });
  }

  const parts = authHeader.split(' ');

  if (parts.length === 2) {
    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).send({ error: 'Token não compatível!' });
    }

    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    next();
  }
  return res.status(401).send({ error: 'Token mal formado!' });
}
