import express from 'express';

import postController from '../controllers/post.controller';
// import validateProduct from '../middleware/validators/productsValidator';

const router = express.Router();

router.get('/all', postController.getAll);
router.get('/client', postController.client);
router.get('/id/:id', postController.getById);
router.get('/category/:categoryId', postController.getByCategory);
router.post('/create/', postController.create);
router.patch('/update/:id', postController.update);
router.delete('/remove/:id', postController.softDelete);
router.get('/deleted/', postController.getDeleted);
router.post('/restore/:id', postController.restore);
router.delete('/delete/:id', postController.hardDelete);
router.get('/check/unique', postController.checkProductUnique);

export default router;
