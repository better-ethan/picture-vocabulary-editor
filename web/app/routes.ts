import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "page/home.tsx"),
  route("/todo", "page/todo.tsx"),
  route("/picture-lesson/:id/:slug", "page/picture-lesson/index.tsx"),
  route("/picture-lesson/create", "page/picture-lesson/create.tsx"),
  route("/picture-lesson/:id/edit", "page/picture-lesson/edit.tsx"),
] satisfies RouteConfig;
