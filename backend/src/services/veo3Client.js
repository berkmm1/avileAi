import fetch from 'node-fetch';
import logger from '../utils/logger.js';

const VEO3_BASE = process.env.VEO3_BASE || 'https://api.veo3gen.co';
const VEO3_KEY = process.env.VEO3_API_KEY || '';

export async function createVideoJob(prompt, params){
  // In production replace this with real VEO3 request.
  logger.info('Simulating VEO3 job create for prompt: '+prompt.slice(0,60));
  // return fake response
  return { id: 'job_'+Date.now(), status:'queued', result_url:null };
}

export async function getJobStatus(jobId){
  // Simulate completed result after worker processing
  return { id: jobId, status: 'completed', result_url: `https://example.com/fake/${jobId}.mp4` };
}
