import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("page/public-layout.tsx", [
    route("/", "page/home.tsx"),

    route("/picture-vocab/list", "page/picture-vocab/list.tsx"),
    route("/category/:slug", "page/category/index.tsx"),
    route("/picture-vocab/:id/:slug", "page/picture-vocab/index.tsx"),

    // user
    route("/signup", "page/user/signup.tsx"),
    route("/signin", "page/user/signin.tsx"),
    route(
      "/user/request-reset-password",
      "page/user/request-reset-password.tsx"
    ),
    route("/user/reset-password", "page/user/reset-password.tsx"),

    route("/user/:id/:slug", "page/user/public.user.index.tsx"),

    route("/pricing/plan", "page/pricing/plan.tsx"),
    route("/pricing/success", "page/pricing/success.tsx"),
    route("/pricing/cancel", "page/pricing/cancel.tsx"),

    route("/contact-us", "page/contact-us.tsx"),
    route("/privacy-policy", "page/privacy-policy.tsx"),
    route("/terms-of-use", "page/terms-of-use.tsx"),
    route("/about", "page/about.tsx"),

    route("/blog", "page/blog/list.tsx", { index: true }),
    route("/blog/:slug", "page/blog/index.tsx"),

    route("*", "page/not-found.tsx"),
  ]),

  layout("page/admin-layout.tsx", [
    route("/admin/picture-vocab/create", "page/picture-vocab/create.tsx"),
    route("/admin/picture-vocab/:id/:slug/edit", "page/picture-vocab/edit.tsx"),
    route(
      "/admin/picture-vocab/:id/:slug/delete",
      "page/picture-vocab/delete.tsx"
    ),

    route("/admin/picture-vocab/authored", "page/picture-vocab/authored.tsx"),

    route("/admin/user/profile", "page/user/profile.tsx"),
    route("/admin/user/change-password", "page/user/change-password.tsx"),

    route("/admin/user/current-plan", "page/user/current-plan.tsx"),

    route("/admin/*", "page/not-found.tsx", { id: "admin-not-found" }),
  ]),

  // embed
  route("/embed/vocab/:id/:slug", "page/picture-vocab/embed.tsx"),

  // api
  route("/api/auth/*", "api/auth.tsx"),
] satisfies RouteConfig;
