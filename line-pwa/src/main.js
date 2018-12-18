import 'jscatalyst/dist/jscatalyst.min.css';
import Vue from 'vue';
import GlueNotAvailable from './GlueNotAvailable.vue';
import Vuetify from 'vuetify';
import { ThemePlugin } from 'jscatalyst';
import App from './App.vue';
import router from './router';
import store from './store';
import VueSocketio from 'vue-socket.io';
import '../node_modules/vuetify/dist/vuetify.min.css';
import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import "typeface-roboto";
import './registerServiceWorker';

import GlueFiltering from './plugins/GlueFiltering'
import SocketFiltering from './plugins/SocketFiltering'

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
    Vue.use(GlueFiltering)
    new Vue({
      router,
      store,
      render: h => h(App),
      created(){
        this.initializeTheme()
        this.initializeGlueContext()
      }
    }).$mount('#app');
  })
  .catch(err => {
    Vue.use(SocketFiltering)
    new Vue({
      router,
      store,
      render: h => h(App),
      created(){
        this.initializeSocketContext()
        this.initializeDataStream()
      }
    }).$mount('#app');
  });
