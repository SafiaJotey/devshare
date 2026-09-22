import { Router } from "express";
import { AuthRoutes, UserRoutes } from "../modules/user/user.route";
import { BlogRoutes } from "../modules/blog/blog.route";

const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

