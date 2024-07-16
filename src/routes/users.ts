import express from 'express';

import userController from '../controllers/user.controller';
import validateUser from '../middleware/validators/usersValidator';

const router = express.Router();

router.get('/all', userController.getAll);
router.get('/id/:id', userController.getById);
router.post('/create/', validateUser, userController.create);
router.patch('/update/:id', userController.update);
router.delete('/remove/:id', userController.softDelete);
router.get('/deleted/', userController.getDeleted);
router.post('/restore/:id', userController.restore);
router.delete('/delete/:id', userController.hardDelete);
router.get('/check/unique', userController.checkUserUnique);

export default router;
