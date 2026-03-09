import express from 'express';
import Queue from 'bullmq';
import JobModel from '../models/Job.js';
import auth from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import IORedis from 'ioredis';

const router = express.Router();

let videoQueue;
function getVideoQueue(){
  if(videoQueue) return videoQueue;
  const connection = new IORedis(process.env.REDIS_URL);
  videoQueue = new Queue.Queue('video-jobs', { connection });
  return videoQueue;
}

router.post('/create', auth, async (req,res)=>{
  try{
    const { prompt, params } = req.body;
    if(!prompt) return res.status(400).json({ error:'prompt required' });

    const jobDoc = await JobModel.create({ userId: req.user.id, prompt, params, status:'queued' });
    const queue = getVideoQueue();
    const jobId = uuidv4();
    await queue.add('create', { jobDocId: jobDoc._id.toString(), prompt, params }, { jobId });
    logger.info('Enqueued job '+jobDoc._id);
    return res.json({ jobId: jobDoc._id });
  }catch(e){
    logger.error('video.create error:'+e.message);
    return res.status(500).json({ error:'server error' });
  }
});

router.get('/status/:id', auth, async (req,res)=>{
  try{
    const job = await JobModel.findOne({ _id: req.params.id, userId: req.user.id });
    if(!job) return res.status(404).json({ error:'not found' });
    return res.json({ status: job.status, resultUrl: job.resultUrl });
  }catch(e){
    return res.status(500).json({ error:'server error' });
  }
});

router.get('/list', auth, async (req,res)=>{
  try{
    const jobs = await JobModel.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    return res.json(jobs);
  }catch(e){
    logger.error('video.list error:'+e.message);
    return res.status(500).json({ error:'server error' });
  }
});

export default router;
