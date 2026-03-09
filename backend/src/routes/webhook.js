import express from 'express';
import logger from '../utils/logger.js';
import JobModel from '../models/Job.js';
const router = express.Router();

router.post('/veo3', async (req,res)=>{
  // verify signature in prod
  const { jobId, status, result_url } = req.body || {};
  if(!jobId) return res.status(400).json({ error:'missing jobId' });
  try{
    const job = await JobModel.findOne({ _id: jobId });
    if(job){
      job.status = status || job.status;
      if(result_url) job.resultUrl = result_url;
      await job.save();
    }
    logger.info('Webhook updated job '+jobId);
    return res.json({ ok:true });
  }catch(e){
    logger.error('webhook error:'+e.message);
    return res.status(500).json({ error:'server error' });
  }
});

export default router;
