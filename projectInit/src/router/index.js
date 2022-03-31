import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    redirect: "/index",
  },
  {
    path: "/app",
    name: "App",
    component: () => import("../App.vue"),
  },
  {
    path: "/index",
    name: "Index",
    meta: {
      title: "首页",
      requireAuth: true,
  },
    component: (resolve) => require(["../views/Index.vue"], resolve),
  },
];

const router = new VueRouter({
  mode: "hash", // history
  // base: process.env.BASE_URL,
  routes,
});

export default router;
