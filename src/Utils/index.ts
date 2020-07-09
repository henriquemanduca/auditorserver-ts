import { generate } from 'generate-password';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import dotEnv from 'dotenv';

import authConfig from '../config/auth';
import 'moment/locale/pt-br';

dotEnv.config();
moment.locale('pt-br');

interface User {
  id: string;
}

class Utils {
  public checkDirectory(directory: string): void {
    try {
      fs.statSync(directory);
    } catch (e) {
      fs.mkdirSync(directory);
    }
  }

  public log(message: string): void {
    this.checkDirectory('./logs');

    const data = moment().format('DD-MM-YYYY');
    const hora = moment().format('HH:mm:ss');
    const msg = `\n[${hora}]: ${message}`;

    fs.appendFile(`./logs/${data}.log`, msg, (err) => {
      if (err) throw err;
    });
  }

  public generatePassword(length: number): string {
    const password = generate({ length, numbers: true });

    return password;
  }

  public generateToken(user: User): string {
    return jwt.sign(user.id, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
    });
  }

  public getMongoURL(): string {
    if (process.env.NODE_ENV === 'development') {
      return String(process.env.ADT_MONGO_ATLAS);
    }
    return String(process.env.ADT_MONGO_URL);
  }
}

export default new Utils();
