import { Request, Response } from 'express';

import Entity, {
  IEntityModel,
  ICnaeModel,
  IEnderecoModel,
} from '../models/entity';
import sintegraWs from '../services/sintegraWS';
import systemParams from '../config/system';
import utils from '../Utils';

class EntityController {
  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { entityId } = req.params;
      const entidade = await Entity.findById(entityId);
      return res.send({ entidade });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível buscar por ID!' });
    }
  }

  public async entityInfo(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj, nome } = req.body;
      const entity = await Entity.findOne({ cnpj });

      if (entity) {
        return res.send({ entity });
      }

      const result = await sintegraWs.getEntitySN(cnpj);
      const entityObj = {
        razao: result.nome_empresarial,
        nome,
        cnpj,
        simples: !(
          result.situacao_simples_nacional ===
          'NÃO optante pelo Simples Nacional'
        ), // || result.situacao_simples_nacional.indexOf('NÃO') === -1,
        simplesAnterior: result.situacao_simples_nacional_anterior,
        simplesFuturo: result.eventos_futuros_simples_nacional,
        consultado: new Date(),
        cnae: [],
      };

      const newEntity = await Entity.create({
        ...entityObj,
      });

      return res.send({ entity: newEntity });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível consultar!' });
    }
  }

  public async entityInfoCNAE(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj, nome } = req.body;
      const entity = await Entity.findOne({ cnpj });

      if (entity && entity.cnae.length > 0) {
        return res.send({ entity });
      }

      const result = await sintegraWs.getEntityRF(cnpj);

      const endereco = {
        uf: result.uf,
        municipio: result.municipio,
        bairro: result.bairro,
        logradouro: result.logradouro,
        complemento: result.complemento,
        numero: result.numero,
        cep: result.cep,
      } as IEnderecoModel;

      const cnae: Array<ICnaeModel> = [];

      result.atividade_principal.forEach((item) => {
        const newCnae = {
          principal: true,
          codigo: item.code,
          texto: item.text,
        } as ICnaeModel;
        cnae.push(newCnae);
      });

      result.atividades_secundarias.forEach((item) => {
        const newCnae = {
          principal: false,
          codigo: item.code,
          texto: item.text,
        } as ICnaeModel;
        cnae.push(newCnae);
      });

      const entityObj = {
        razao: result.nome_empresarial,
        nome,
        cnpj,
        endereco,
        simples: true,
        simplesAnterior: '',
        simplesFuturo: '',
        consultado: new Date(),
        cnae,
      };

      const newEntity = await Entity.create({
        ...entityObj,
      });

      return res.send({ entity: newEntity });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível consultar!' });
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
        .limit(systemParams.restFull.maxitemsPagination)
        .skip(systemParams.restFull.maxitemsPagination * (page - 1))
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
      const { razao, nome, simples, cnae } = req.body;

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
      return res.status(400).send({ error: 'Não foi possível atualizar!' });
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
      return res.status(400).send({ error: 'Não foi possível deletar!' });
    }
  }
}

export default new EntityController();
