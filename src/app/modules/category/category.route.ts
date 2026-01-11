import express from 'express';
import validateRequest from '../../middlewares/validate-request';
import { CategoryValidations } from './category.validation';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.Admin),
    CategoryControllers.getCategories
);

router.post(
    '/',
    auth(USER_ROLE.Admin),
    validateRequest(CategoryValidations.createCategorySchema),
    CategoryControllers.createCategory,
);

router.patch(
    '/:id',
    auth(USER_ROLE.Admin),
    validateRequest(CategoryValidations.updateCategorySchema),
    CategoryControllers.updateCategoryById,
);

export const CategoryRoutes = router;