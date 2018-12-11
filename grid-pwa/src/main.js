import Vue from 'vue';
import App from './App.vue';
import '../node_modules/ag-grid/dist/styles/ag-grid.css';
import '../node_modules/ag-grid/dist/styles/ag-theme-material.css';
import '../node_modules/ag-grid/dist/styles/ag-theme-dark.css';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueSocketio from 'vue-socket.io';
import Vuetify from 'vuetify';
import GlueFiltering from './plugins/GlueFiltering'
import SocketFiltering from './plugins/SocketFiltering'

import 'jscatalyst/dist/jscatalyst.min.css';
import '../node_modules/vuetify/dist/vuetify.min.css';
import 'typeface-roboto';

import { ThemePlugin } from 'jscatalyst';

Vue.config.productionTip = false;

Vue.use(VueSocketio, 'http://localhost:9000');
Vue.use(Vuetify);
Vue.use(ThemePlugin, {
  store,
  custom: false
});

Glue({})
  .then(glue => {
    window.glue = glue;
    Vue.use(GlueFiltering)
    new Vue({
      router,
      store,
      created(){
        this.initializeTheme()
        this.initializeGlueContext()
      },
      render: h => h(App)
    }).$mount('#app');
  })
  .catch(err => {
    Vue.use(SocketFiltering)
    new Vue({
      router,
      store,
      created(){
        this.initializeSocketContext()
        this.initializeDataStream()
      },
      render: h => h(App)
    }).$mount('#app');
  });
