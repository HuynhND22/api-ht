import express from 'express';

import categoryController from '../controllers/category.controller';
import validateCategory from '../middleware/validators/categoriesValidator';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.get('/all', categoryController.getAll);
router.get('/id/:id', categoryController.getById);
router.post('/create/', isLogin, isAdmin, validateCategory, categoryController.create);
router.patch('/update/:id', isAdmin, isLogin, validateCategory, categoryController.update);
router.delete('/remove/:id', isLogin, isAdmin, categoryController.softDelete);
router.get('/deleted/', categoryController.getDeleted);
router.post('/restore',categoryController.restore);
router.delete('/delete/:id', isLogin, isAdmin, categoryController.hardDelete);
router.get('/check/unique', categoryController.checkCategoryUnique);

export default router;
