import { Request, Response } from 'express';
import Product, { IProductModel } from '../models/product';
import systemParams from '../config/system';

class ProductController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const page = Number(req.query.page);
      const { empresa } = req.body;

      if (empresa === undefined) {
        return res.status(400).send({ error: 'Parâmetro inválido!' });
      }

      const count = await Product.countDocuments({ empresa });
      res.header('X-Products-Count', String(count));

      if (page === 0) {
        return res.send({ message: 'OK' });
      }

      const products = await Product.find()
        .limit(systemParams.restFull.maxitemsPagination)
        .skip(systemParams.restFull.maxitemsPagination * (page - 1))
        .sort({ nome: 'asc' });

      return res.send({ count: products.length, products });
    } catch (error) {
      return res.status(400).send({ error: 'Não foi possível listar!' });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { products } = req.body;

      await products.map(async (product: IProductModel) => {
        const { empresa, codigo1 } = product;

        const foud = await Product.findOne({ empresa, codigo1 });

        if (foud === null) {
          await Product.create({ ...product });
        }
      });

      return res.send({ msg: 'OK!' });
    } catch (error) {
      return res.status(400).send({ error: 'Registro não criados!' });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      return res.send({ msg: 'OK!' });
    } catch (error) {
      return res
        .status(400)
        .send({ error: 'Não foi possível consultar!', message: error.message });
    }
  }
}

export default new ProductController();
