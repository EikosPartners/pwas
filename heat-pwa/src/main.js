import Vue from 'vue';
import App from './App.vue';
import GlueNotAvailable from './GlueNotAvailable.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueSocketio from 'vue-socket.io';
import Vuetify from 'vuetify';

import "../node_modules/vuetify/dist/vuetify.min.css";
import 'jscatalyst/dist/jscatalyst.min.css';
import "typeface-roboto";

import { ThemePlugin } from 'jscatalyst';

Vue.config.productionTip = false;

Vue.use(VueSocketio, 'http://localhost:9000');
Vue.use(Vuetify);
Vue.use(ThemePlugin, {
  store,
  custom: false
});

// Initialize the Glue42 Environment

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
      render: h => h(GlueNotAvailable)
    }).$mount('#app');
  });
