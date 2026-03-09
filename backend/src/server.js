import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './utils/logger.js';
import app from './app.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { })
  .then(()=> logger.info('MongoDB connected'))
  .catch(err => logger.error('Mongo connect error: '+err.message));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> logger.info(`AliveAI backend listening on ${PORT}`));
