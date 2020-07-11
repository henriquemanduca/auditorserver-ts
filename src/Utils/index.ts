import { generate } from 'generate-password';
import { sign } from 'jsonwebtoken';
import moment from 'moment';
import fs from 'fs';

import dotEnv from 'dotenv';

import authConfig from '../config/auth';
import 'moment/locale/pt-br';

dotEnv.config();
moment.locale('pt-br');

interface UserPayLoad {
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

  public generateToken(user: UserPayLoad): string {
    return sign(user, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn,
    });
  }

  public getMongoURL(): string {
    if (process.env.NODE_ENV === 'development') {
      return process.env.ADT_MONGO_ATLAS as string;
    }
    return process.env.ADT_MONGO_URL as string;
  }
}

export default new Utils();
