import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("page/public-layout.tsx", [
    route("/", "page/home.tsx"),

    route("/picture-lesson/list", "page/picture-lesson/list.tsx"),
    route("/category/:slug", "page/category/index.tsx"),
    route("/picture-lesson/:id/:slug", "page/picture-lesson/index.tsx"),

    // user
    route("/signup", "page/user/signup.tsx"),
    route("/signin", "page/user/signin.tsx"),
    route(
      "/user/request-reset-password",
      "page/user/request-reset-password.tsx"
    ),
    route("/user/reset-password", "page/user/reset-password.tsx"),

    route("/user/:id/:slug", "page/user/public.user.index.tsx"),

    route("/membership/plan", "page/membership/plan.tsx"),
    route("/membership/success", "page/membership/success.tsx"),
    route("/membership/cancel", "page/membership/cancel.tsx"),

    route("/contact-us", "page/contact-us.tsx"),

    route("/blog", "page/blog/list.tsx", { index: true }),
    route("/blog/:slug", "page/blog/index.tsx"),

    route("*", "page/not-found.tsx"),
  ]),

  layout("page/admin-layout.tsx", [
    route("/admin/picture-lesson/create", "page/picture-lesson/create.tsx"),
    route(
      "/admin/picture-lesson/:id/:slug/edit",
      "page/picture-lesson/edit.tsx"
    ),
    route(
      "/admin/picture-lesson/:id/:slug/delete",
      "page/picture-lesson/delete.tsx"
    ),

    route("/admin/picture-lesson/authored", "page/picture-lesson/authored.tsx"),

    route("/admin/user/profile", "page/user/profile.tsx"),
    route("/admin/user/change-password", "page/user/change-password.tsx"),

    route("/admin/user/current-plan", "page/user/current-plan.tsx"),

    route("/admin/*", "page/not-found.tsx", { id: "admin-not-found" }),
  ]),

  // embed
  route("/embed/vocab/:id/:slug", "page/picture-lesson/embed.tsx"),

  // api
  route("/api/auth/*", "api/auth.tsx"),
] satisfies RouteConfig;
