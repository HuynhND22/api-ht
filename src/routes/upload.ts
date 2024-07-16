import express from 'express';

import uploadController from '../controllers/upload.controller';


const router = express.Router();

router.post('/posts', uploadController.posts);

export default router;
