import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface ICestModel extends Document {
  codigo: string;
}

export interface IProviderModel extends Document {
  cnpj: string;
  codigo: string;
  ean: string;
  ean_trib: string;
}

export interface IUnidadeModel extends Document {
  unidade: string;
  descricao: string;
  fator: number;
  estoque: boolean;
}

export interface IProductModel extends Document {
  empresa: string;
  codigo1: string;
  codigo2: string;
  descricao: string;
  ean: string;
  ean_trib: string;
  ncm: string;
  cest: [ICestModel];
  providers: [IProviderModel];
  versao: number;
  createAt?: Date;
  updateAt?: Date;
}

const CestSchema: Schema = new Schema(
  {
    codigo: { type: String, require: true },
  },
  { _id: false },
);

const ProviderSchema: Schema = new Schema(
  {
    cnpj: { type: String, require: true },
    codigo: { type: String, require: true },
    ean: { type: String, require: true },
    ean_trib: { type: String, require: false },
  },
  { _id: false },
);

const UnidadeSchema: Schema = new Schema(
  {
    unidade: { type: String, require: true },
    descricao: { type: String, require: false },
    fator: { type: Number, require: true },
    estoque: { type: Boolean, require: true },
  },
  { _id: false },
);

const ProductSchema: Schema = new Schema({
  empresa: { type: String, required: true },
  codigo1: { type: String, required: true },
  codigo2: { type: String, required: false },
  descricao: { type: String, required: true },
  ean: { type: String, required: false },
  ean_trib: { type: String, required: false },
  ncm: { type: String, required: false },
  unidades: [UnidadeSchema],
  cest: [CestSchema],
  providers: [ProviderSchema],
  versao: { type: Number, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

ProductSchema.pre<IProductModel>('save', async function (next): Promise<void> {
  this.updateAt = new Date();
  next();
});

const Product = mongoose.model<IProductModel>('Products', ProductSchema);

export default Product;
