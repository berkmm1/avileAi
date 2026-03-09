import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import webhookRoutes from './routes/webhook.js';
import aiRoutes from './routes/ai.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.PUBLIC_URL || true }));
app.use(bodyParser.json({limit:'1mb'}));

const limiter = rateLimit({ windowMs: 15*60*1000, max: 200 });
app.use(limiter);

app.get('/health', (req,res)=> res.json({status:'ok'}));
app.use('/auth', authRoutes);
app.use('/video', videoRoutes);
app.use('/webhook', webhookRoutes);
app.use('/ai', aiRoutes);

export default app;
