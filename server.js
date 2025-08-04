import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import emailRoute from './routes/emailRoute.js';
import agentRoutes from './routes/agentRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Route
app.use('/api/agents', agentRoutes);
app.use('/api', emailRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));
