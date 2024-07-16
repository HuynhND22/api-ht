import express from 'express';

import authController from '../controllers/authentication.controller';
import validateAuth from '../middleware/validators/authenticationsValidator';

const router = express.Router();

router.post('/login', validateAuth, authController.login);

export default router;
