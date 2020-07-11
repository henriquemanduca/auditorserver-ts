import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface ICnaeModel extends Document {
  principal: boolean;
  codigo: string;
  texto: string;
}

export interface IEnderecoModel extends Document {
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  complemento: string;
  numero: string;
  cep: string;
}

export interface IEntityModel extends Document {
  razao: string;
  nome: string;
  cnpj: string;
  simples: boolean;
  simplesAnterior: string;
  simplesFuturo: string;
  cnae: [ICnaeModel];
  endereco?: IEnderecoModel;
  consultado: Date;
  createAt?: Date;
}

const EnderecoSchema: Schema = new Schema(
  {
    uf: {
      type: String,
    },
    municipio: {
      type: String,
    },
    bairro: {
      type: String,
    },
    logradouro: {
      type: String,
    },
    complemento: {
      type: String,
    },
    cep: {
      type: String,
    },
  },
  { _id: false },
);

const CnaeSchema: Schema = new Schema(
  {
    codigo: {
      type: String,
      require: true,
    },
    texto: {
      type: String,
      require: true,
    },
    principal: {
      type: Boolean,
      require: true,
    },
  },
  { _id: false },
);

const EntitySchema: Schema = new Schema({
  razao: {
    type: String,
    require: true,
  },
  nome: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  cnpj: {
    type: String,
    require: true,
  },
  simples: {
    type: Boolean,
    require: true,
  },
  simplesAnterior: {
    type: String,
    require: true,
  },
  simplesFuturo: {
    type: String,
    require: true,
  },
  cnae: [CnaeSchema],
  endereco: EnderecoSchema,
  consultado: {
    type: Date,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Entity = mongoose.model<IEntityModel>('Entities', EntitySchema);

export default Entity;
