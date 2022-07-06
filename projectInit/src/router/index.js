import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    redirect: "/toDoc",
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
  {
    path: "/toPDF",
    name: "toPDF",
    component: (resolve) => require(["../views/toPDF/toPDF.vue"], resolve),
  },
  {
    path: "/toDoc",
    name: "toDoc",
    component: (resolve) => require(["../views/doc/ProjectDoc.vue"], resolve),
  },
];

const router = new VueRouter({
  mode: "hash", // history
  // base: process.env.BASE_URL,
  routes,
});

export default router;
