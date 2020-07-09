import express from 'express';
import mongoose from './database';

import routes from './routes';

const PORT = Number(process.env.ADT_SERVER_PORT) || 3006;
const app = express();

app.use(express.json());

app.on('ready', () => {
  app.use(routes);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuditorServer-TS running on ${PORT}.`);
  });
});

mongoose.connection.once('open', () => {
  console.log('Starting service...');
  app.emit('ready');
});
