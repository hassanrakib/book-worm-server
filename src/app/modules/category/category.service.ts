import { ICategory } from "./category.interface";
import { Category } from "./category.model";


const insertCategoryIntoDB = async (payload: ICategory) => {
    return await Category.create(payload);
};

const retrieveCategoriesFromDB = async () => {
    return await Category.find();
};

const updateCategoryByIdIntoDB = async (
    id: string,
    update: Partial<ICategory>
) => {
    return await Category.findByIdAndUpdate(
        id,
        update,
        {
            new: true,
            runValidators: true,
        }
    );
};

export const CategoryServices = {
    insertCategoryIntoDB,
    retrieveCategoriesFromDB,
    updateCategoryByIdIntoDB,  
};