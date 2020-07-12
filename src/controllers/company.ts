import { Request, Response } from 'express';
import Company, { IComapanyModel } from '../models/companies';
import systemParams from '../config/system';
import utils from '../Utils';

class CompanyController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const page = Number(req.query.page);

      const count = await Company.countDocuments();
      res.header('X-Company-Count', String(count));

      if (page === 0) {
        return res.send({ message: 'OK' });
      }

      const companies = await Company.find()
        .limit(systemParams.restFull.maxitemsPagination)
        .skip(systemParams.restFull.maxitemsPagination * (page - 1))
        .sort({ nome: 'asc' });

      return res.send({ count: companies.length, companies });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível listar!' });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;
      const company = await Company.findById(companyId);
      return res.send({ company });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível buscar por ID!' });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj } = req.body;
      const companies = await Company.find({ cnpj });

      let company: IComapanyModel;

      if (companies.length === 0) {
        company = await Company.create({ ...req.body });
        return res.send({ company });
      }
      return res.status(400).send({ error: 'Registro já criado.' });
    } catch (error) {
      return res.status(400).send({ error: 'Registro não criado!' });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;
      const { razao, cnpj } = req.body;

      const company = await Company.findByIdAndUpdate(
        { _id: companyId },
        { razao, cnpj },
        { new: true },
      );

      if (company) {
        await company.save();
        utils.log(`Executado update em ${company.cnpj}`);

        return res.send({ company });
      }
      return res.status(400).send({ error: 'Registro não encontrado.' });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível atualizar!' });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { companyId } = req.params;
      const company = await Company.findByIdAndRemove(companyId);
      if (company) {
        utils.log(`${company.cnpj} Removido`);
        return res.send(company);
      }
      return res.status(400).send({ error: 'Registro não encontrado.' });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível deletar!' });
    }
  }
}

export default new CompanyController();
