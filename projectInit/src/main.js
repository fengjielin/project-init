import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axiosApi from "../src/utils/api";
import qs from 'qs';

import "../src/assets/css/common.css";
import "../src/assets/css/common.less";
import "../src/assets/css/reset.css";

console.log("webpack entry");

Vue.prototype.$post = axiosApi.postRequest;
Vue.prototype.$put = axiosApi.putRequest;
Vue.prototype.$get = axiosApi.getRequest;
Vue.prototype.$delete = axiosApi.deleteRequest;
Vue.prototype.$qs = qs;

Vue.prototype.$get("comments");
Vue.prototype.$post("posts", Vue.prototype.$qs.stringify({ title: "foo", body: "bar", userId: 1 }));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');