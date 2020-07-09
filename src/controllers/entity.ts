import { Request, Response } from 'express';

import Entity, { IEntityModel, ICnaeModel } from '../models/entity';
import utils from '../Utils';

class EntityController {
  private maxPerPage = 100;

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { entityId } = req.params;
      const entidade = await Entity.findById(entityId);
      return res.send({ entidade });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível buscar por ID!' });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      // const entidades = await Entidade.find().populate('user');
      const page = Number(req.query.page);

      const count = await Entity.countDocuments();
      res.header('X-Entity-Count', String(count));

      if (page === 0) {
        return res.send({ message: 'OK' });
      }

      const entidades = await Entity.find()
        .limit(this.maxPerPage)
        .skip(this.maxPerPage * (page - 1))
        .sort({ nome: 'asc' });

      return res.send({ count: entidades.length, entidades });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível listar!' });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj } = req.body;
      const entities = await Entity.find({ cnpj });

      let entity: IEntityModel;

      if (entities.length === 0) {
        utils.log(`Inserido ${cnpj}.`);
        entity = await Entity.create({ ...req.body });
        return res.send({ entity });
      }
      return res.status(400).send({ error: 'Registro já criado.' });
    } catch (error) {
      return res.status(400).send({ error: 'Registro não criado!' });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { entityId } = req.params;
      const {
        razao, nome, simples, cnae,
      } = req.body;

      const entity = await Entity.findByIdAndUpdate(
        { _id: entityId },
        { razao, nome, simples },
        { new: true },
      );

      if (entity) {
        if (cnae !== undefined) {
          // entity.cnae = [];
          cnae.forEach((cnaeItem: ICnaeModel) => {
            entity.cnae.push(cnaeItem);
          });
        }

        await entity.save();
        utils.log(`Executado update em ${entity.cnpj}`);

        return res.send({ entity });
      }
      return res.status(400).send({ error: 'Registro não encontrado.' });
    } catch (error) {
      return res
        .status(400)
        .send({ error: 'Não foi possível atualizar!' });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { entityId } = req.params;
      const entity = await Entity.findByIdAndRemove(entityId);
      if (entity) {
        utils.log(`${entity.cnpj} Removido`);
        return res.send(entity);
      }
      return res.status(400).send({ error: 'Registro não encontrado.' });
    } catch (error) {
      return res
        .status(400)
        .send({ error: 'Não foi possível deletar!' });
    }
  }
}

export default new EntityController();
