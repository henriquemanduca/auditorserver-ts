import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface IUCfgModel extends Document {
  remainingQueriesWS: number;
  createAt?: Date;
  updateAt?: Date;
}

const CfgSchema: Schema = new Schema({
  remainingQueriesWS: {
    type: String,
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

const Cfg = mongoose.model<IUCfgModel>('Cfg', CfgSchema);

export default Cfg;
