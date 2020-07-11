import { Request, Response } from 'express';
import { compare } from 'bcryptjs';

import User from '../models/user';
import utils from '../Utils';

// 202 aceito
// 203 não-autorizado
// 204 Nenhum conteúdo

class UserController {
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ login }).select('+password');

      if (!user) {
        utils.log(`Usuário ${login} não encontrado.`);
        return res.status(204).send({ error: 'Não encontrado!' });
      }

      if (!(await compare(password, user.password))) {
        utils.log(`Senha inválida para ${login}.`);
        return res.status(203).send({ error: 'Dados inválidos!' });
      }

      const token = utils.generateToken({ id: user._id });
      utils.log(`Logado com ${login}.`);

      return res.send({ login: user.login, token });
    } catch (error) {
      return res.status(400).send({ error: 'Falha no registrar!' });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.find().select('-_id login createAt');
      return res.status(202).send({ users });
    } catch (error) {
      return res.status(400).send({ error: 'Falha no registrar!' });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { login, password } = req.body;
      // const password = utils.generatePassword(10);
      const user = await User.create({ login, password });
      utils.log(`Novo usuário ${login}`);

      return res.send({ user });
    } catch (error) {
      return res.status(400).send({ error: 'Falha no registrar!' });
    }
  }

  public async refreshPassword(req: Request, res: Response): Promise<Response> {
    const { login, password } = req.body;

    try {
      const user = await User.findOne({ login }).select('login password');
      if (user) {
        // const password = utils.generatePassword(10);
        user.password = password;
        await user.save();

        // mailer.notifaUsuarioSenha(login, password);
        utils.log(`Nova senha para ${login}.`);
        return res.send({ user });
      }
      return res.status(204).send({ error: 'Dados inválidos!' });
    } catch (error) {
      return res.status(400).send({ error: 'Falha ao recuperar credencial!' });
    }
  }
}

export default new UserController();
