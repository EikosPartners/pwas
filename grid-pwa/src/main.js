import Vue from "vue";
import App from "./App.vue";
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueSocketio from "vue-socket.io";

Vue.config.productionTip = false;

Vue.use(VueSocketio, "http://localhost:9000");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
