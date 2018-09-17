import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueSocketio from 'vue-socket.io';
import Vuetify from 'vuetify';
import '../node_modules/vuetify/dist/vuetify.min.css'
import '../node_modules/material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

import 'jscatalyst/dist/jscatalyst.min.css';
import { ThemePlugin } from 'jscatalyst';

Vue.config.productionTip = false;

Vue.use(VueSocketio, 'http://localhost:9000');
Vue.use(ThemePlugin, {
  store,
  themes: ['Blue', 'Pink', 'Green', 'Brown', 'Red', 'Grey']
});
Vue.use(Vuetify);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
