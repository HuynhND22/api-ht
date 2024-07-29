import express from 'express';

import postController from '../controllers/post.controller';
import { uploadR2 } from '../middleware/uploadR2';

const router = express.Router();

router.get('/all', postController.getAll);
router.get('/client', postController.client);
router.get('/id/:id', postController.getById);
router.get('/category/:categoryId', postController.getByCategory);
router.post('/create/', uploadR2, postController.create);
router.patch('/update/:id', uploadR2, postController.update);
router.delete('/remove/:id', postController.softDelete);
router.get('/deleted/', postController.getDeleted);
router.post('/restore/:id', postController.restore);
router.delete('/delete/:id', postController.hardDelete);
router.get('/check/unique', postController.checkProductUnique);

export default router;
