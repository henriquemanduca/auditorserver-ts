import mongoose from 'mongoose';

import utils from '../Utils';
// console.log(utils.getMongoURL());

const urlDB = utils.getMongoURL();
// console.log(`Connect to ${urlDB}.`);
utils.log(`Connect to ${urlDB}.`);

mongoose
  .connect(utils.getMongoURL(), {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log('MongoDB connected.');
    utils.log('Started connection');
  })
  .catch((err) => {
    // console.error('MongoDB not connected: ', err);
    utils.log(`MongoDB not connected: ${err.message}`);
  });

mongoose.Promise = global.Promise;

export default mongoose;
