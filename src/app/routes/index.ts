import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { BookRoutes } from '../modules/book/book.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { ShelfRoutes } from '../modules/shelf/shelf.route';

// it's a mini application also a route handler itself
// every http request to '/api/v1' will be handled by this router
export const router = express.Router();

const routes = [
    {
        path: '/users',
        handler: UserRoutes,
    },
    {
        path: "/auth",
        handler: AuthRoutes,
    },
    {
        path: "/categories",
        handler: CategoryRoutes,
    },
    {
        path: "/books",
        handler: BookRoutes,
    },
    {
        path: "/reviews",
        handler: ReviewRoutes,
    },
    {
        path: "/shelves",
        handler: ShelfRoutes,
    },
];

routes.forEach((route) => router.use(route.path, route.handler));