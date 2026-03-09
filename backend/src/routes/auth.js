import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/register', async (req,res)=>{
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({error:'email & password required'});
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({error:'user exists'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash });
    return res.json({ ok:true, id:user._id });
  }catch(e){
    logger.error('register error:'+e.message);
    return res.status(500).json({ error:'server error' });
  }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error:'invalid' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) return res.status(401).json({ error:'invalid' });
    const token = jwt.sign({ id:user._id, premium:user.premium }, process.env.JWT_SECRET, { expiresIn:'7d' });
    return res.json({ token, premium: user.premium });
  }catch(e){
    logger.error('login error:'+e.message);
    return res.status(500).json({ error:'server error' });
  }
});

export default router;
