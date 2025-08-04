import express from 'express';
import upload  from '../middlewear/multer.js';
import{registerAgent, verifyEmail} from '../controllers/agentController.js';


const router = express.Router();
const upload = multer({dest: 'uploads/'})

router.post('/register', registerAgent);
router.get('/verify-email/:token', verifyEmail);


router.post('/register', upload.single('ninDocument'), registerAgent);  

export default router;