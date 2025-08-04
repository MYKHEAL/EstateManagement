import express from 'express';
import multer from 'multer'
import{registerAgent} from '../controllers/agentController.js';


const router = express.Router();
const upload = multer({dest: 'uploads/'})

router.post('/register', upload.single('ninDocument'), registerAgent);  

export default router;