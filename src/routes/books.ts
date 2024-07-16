import express from 'express';

import bookController from '../controllers/book.controller';
// import validateProduct from '../middleware/validators/productsValidator';

const router = express.Router();

router.get('/all', bookController.getAll);
router.get('/client', bookController.client);
router.get('/id/:id', bookController.getById);
router.get('/category/:categoryId', bookController.getByCategory);
router.post('/create/', bookController.create);
router.patch('/update/:id', bookController.update);
router.delete('/remove/:id', bookController.softDelete);
router.get('/deleted/', bookController.getDeleted);
router.post('/restore', bookController.restore);
router.delete('/delete/:id', bookController.hardDelete);
router.get('/check/unique', bookController.checkProductUnique);

export default router;
