import express from 'express';

import uploadController from '../controllers/upload.controller';
import { uploadR2 } from '../middleware/uploadR2';

const router = express.Router();

router.post('/posts', uploadR2, uploadController.posts);

export default router;
