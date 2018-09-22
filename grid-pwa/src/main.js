import Vue from "vue";
import App from "./App.vue";
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-material.css";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueSocketio from "vue-socket.io";
import Vuetify from "vuetify";

import "jscatalyst/dist/jscatalyst.min.css";
import "../node_modules/vuetify/dist/vuetify.min.css";
import "typeface-roboto";

import { ThemePlugin } from "jscatalyst";

Vue.config.productionTip = false;

Vue.use(VueSocketio, "http://localhost:9000");
Vue.use(Vuetify);
Vue.use(ThemePlugin, {
  store,
  custom: false
});

Glue({})
  .then(glue => {
    window.glue = glue;

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  })
  .catch(err => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  });
