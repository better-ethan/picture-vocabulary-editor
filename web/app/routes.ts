import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "page/home.tsx"),
  route("/todo", "page/todo.tsx"),

  route("/picture-lesson/create", "page/picture-lesson/create.tsx"),
  route("/picture-lesson/list", "page/picture-lesson/list.tsx"),

  route("/picture-lesson/:id/:slug", "page/picture-lesson/index.tsx"),
  route("/picture-lesson/:id/:slug/edit", "page/picture-lesson/edit.tsx"),

  // user
  route("/signup", "page/user/signup.tsx"),
  route("/signin", "page/user/signin.tsx"),

  // api
  route("/api/auth/*", "api/auth.tsx"),
] satisfies RouteConfig;
