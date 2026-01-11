import { ICategory } from './category.interface';
import { CategoryServices } from './category.service';
import { makeController } from '../../utils/controller-factory';

const createCategory = makeController<{}, ICategory>({
  service: ({ body }) => CategoryServices.insertCategoryIntoDB(body),
  successMessage: 'Category added successfully',
});

const getCategories = makeController({
  service: () => CategoryServices.retrieveCategoriesFromDB(),
  successMessage: 'Categories retrieved successfully',
});

const updateCategoryById = makeController<{ id: string }, Partial<ICategory>>({
  service: ({ params, body }) =>
    CategoryServices.updateCategoryByIdIntoDB(params.id, body),
  successMessage: 'Category updated successfully',
  notFound: {
    message: 'Category not found',
  },
});

export const CategoryControllers = {
  createCategory,
  getCategories,
  updateCategoryById,
};