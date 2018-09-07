import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueSocketio from "vue-socket.io";

import "jscatalyst/dist/jscatalyst.min.css";
import { ThemePlugin } from "jscatalyst";

Vue.config.productionTip = false;

Vue.use(VueSocketio, "http://localhost:9000");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
