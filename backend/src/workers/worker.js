import IORedis from 'ioredis';
import { Worker } from 'bullmq';
import JobModel from '../models/Job.js';
import mongoose from 'mongoose';
import { createVideoJob, getJobStatus } from '../services/veo3Client.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=> logger.info('Worker connected to Mongo'));

const connection = new IORedis(process.env.REDIS_URL);
const worker = new Worker('video-jobs', async job => {
  logger.info('Worker processing job '+job.id);
  const { jobDocId, prompt, params } = job.data;
  const jobDoc = await JobModel.findById(jobDocId);
  if(!jobDoc) return;
  jobDoc.status = 'processing';
  await jobDoc.save();

  // create job on VEO3 (stub)
  const veoResp = await createVideoJob(prompt, params);
  // simulate waiting/polling
  const status = await getJobStatus(veoResp.id);
  jobDoc.status = status.status || 'completed';
  jobDoc.resultUrl = status.result_url || status.resultUrl || null;
  jobDoc.updatedAt = new Date();
  await jobDoc.save();
  logger.info('Worker finished job '+jobDocId);
}, { connection });

worker.on('completed', job => logger.info('Worker completed internal job '+job.id));
worker.on('failed', (job, err) => logger.error('Worker failed '+job.id+' err:'+err.message));
