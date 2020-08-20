import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface ICfgModel extends Document {
  remainingQueriesWS: number;
  createAt?: Date;
  updateAt?: Date;
}

const CfgSchema: Schema = new Schema({
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

CfgSchema.pre<ICfgModel>('save', async function (next): Promise<void> {
  this.updateAt = new Date();
  next();
});

const Cfg = mongoose.model<ICfgModel>('Cfg', CfgSchema);

export default Cfg;
