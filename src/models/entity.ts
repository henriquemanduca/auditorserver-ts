import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface ICnaeModel extends Document {
  codigo: string;
  texto: string;
  principal: boolean;
}

export interface IEntityModel extends Document {
  razao: string;
  nome: string;
  cnpj: string;
  simples: boolean;
  cnae: [ICnaeModel];
  consultado?: Date;
  createAt?: Date;
}

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
  cnpj: {
    type: String,
    require: true,
  },
  simples: {
    type: Boolean,
    require: true,
  },
  cnae: [CnaeSchema],
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
