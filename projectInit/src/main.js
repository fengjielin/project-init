import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import axiosApi from "../src/utils/api";
import Utils from "./utils/utils";
import qs from "qs";
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import "../src/assets/css/common.css";
import "../src/assets/css/common.less";
import "../src/assets/css/reset.css";

// 图片预览组件
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source",
  },
});

console.log("webpack entry");

Vue.prototype.baseURL = "http://127.0.0.1:3000/";
// Vue.prototype.baseURL = "http://119.23.50.91:3000/";
Vue.prototype.$post = axiosApi._post;
Vue.prototype.$put = axiosApi._put;
Vue.prototype.$get = axiosApi._get;
Vue.prototype.$delete = axiosApi._delete;
Vue.prototype.$qs = qs;
Vue.prototype.$utils = Utils;
Vue.prototype.axios = axios;

// Vue.prototype.$get("comments");
// Vue.prototype.$post(
//   "posts",
//   Vue.prototype.$qs.stringify({
//     title: "foo",
//     body: "bar",
//     userId: 1,
//   })
// );

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
