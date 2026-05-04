import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("page/public-layout.tsx", [
    route("/", "page/home.tsx"),
    route("/todo", "page/todo.tsx"),

    route("/picture-lesson/list", "page/picture-lesson/list.tsx"),
    route("/picture-lesson/:id/:slug", "page/picture-lesson/index.tsx"),

    // user
    route("/signup", "page/user/signup.tsx"),
    route("/signin", "page/user/signin.tsx"),
    route(
      "/user/request-reset-password",
      "page/user/request-reset-password.tsx"
    ),
    route("/user/reset-password", "page/user/reset-password.tsx"),

    route("*", "page/not-found.tsx"),
  ]),

  layout("page/admin-layout.tsx", [
    route("/admin/picture-lesson/create", "page/picture-lesson/create.tsx"),
    route(
      "/admin/picture-lesson/:id/:slug/edit",
      "page/picture-lesson/edit.tsx"
    ),

    route("/admin/user/profile", "page/user/profile.tsx"),
    route("/admin/user/change-password", "page/user/change-password.tsx"),
    route("/admin/*", "page/not-found.tsx", { id: "admin-not-found" }),
  ]),

  // api
  route("/api/auth/*", "api/auth.tsx"),
] satisfies RouteConfig;
