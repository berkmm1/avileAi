import express from 'express';
import auth from '../middleware/authMiddleware.js';
import logger from '../utils/logger.js';
import { runQSharpFiveLayerDecision } from '../services/qsharpDecisionEngine.js';
import { generateAssistantAnswer } from '../services/aiClient.js';

const router = express.Router();

router.post('/assist', auth, async (req,res)=>{
  try{
    const { prompt, context } = req.body || {};
    if(!prompt) return res.status(400).json({ error: 'prompt required' });

    const decision = runQSharpFiveLayerDecision({ prompt, context: Array.isArray(context) ? context : [] });
    if(!decision.approved){
      return res.status(400).json({
        error: 'request blocked by safety layer',
        decision
      });
    }

    const answer = await generateAssistantAnswer({ prompt, decisionMeta: decision });
    return res.json({ answer, decision });
  }catch(e){
    logger.error('ai.assist error:'+e.message);
    return res.status(500).json({ error:'server error' });
  }
});

export default router;
