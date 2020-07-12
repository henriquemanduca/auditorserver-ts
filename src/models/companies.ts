import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface IResumeModel extends Document {
  season: Date;
  createAt?: Date;
  updateAt?: Date;
}

export interface IComapanyModel extends Document {
  razao: string;
  cnpj: string;
  season: [IResumeModel];
  createAt?: Date;
  updateAt?: Date;
}

const CompanySchema: Schema = new Schema({
  remainingQueriesWS: {
    type: Number,
    require: true,
    unique: true,
    lowercase: true,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

CompanySchema.pre<IComapanyModel>('save', async function (next): Promise<void> {
  this.updateAt = new Date();
  next();
});

const Company = mongoose.model<IComapanyModel>('Companies', CompanySchema);

export default Company;
