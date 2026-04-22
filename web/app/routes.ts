import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "page/home.tsx"),
  route("/todo", "page/todo.tsx"),
  route("/picture-lesson/:id/:slug", "page/picture-lesson/index.tsx"),
] satisfies RouteConfig;
