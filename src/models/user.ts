import { hash } from 'bcryptjs';
import { Document, Schema } from 'mongoose';
import mongoose from '../database';

export interface IUserModel extends Document {
  login: string;
  password: string;
  guidKey: string;
  enabled?: boolean;
  updateAt?: Date;
  createAt?: Date;
}

const UserSchema: Schema = new Schema({
  login: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  guidKey: {
    type: String,
    require: true,
    select: false,
  },
  enabled: {
    type: Boolean,
    select: false,
    default: false,
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

UserSchema.pre<IUserModel>('save', async function (next): Promise<void> {
  this.updateAt = new Date();
  this.password = await hash(this.password, 1);
  next();
});

const User = mongoose.model<IUserModel>('User', UserSchema);

export default User;
