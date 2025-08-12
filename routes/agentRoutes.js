import express from 'express';
import upload from '../middleware/multer.js'; // keep your custom upload middleware
import { registerAgent, verifyEmailCode } from '../controller/registerAgent.js';

const router = express.Router();

router.post('/register', upload.single('ninDocument'), registerAgent);

router.post('/verify-email/', verifyEmailCode);

export default router;
