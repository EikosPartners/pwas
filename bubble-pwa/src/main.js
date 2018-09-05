import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueSocketio from 'vue-socket.io';
import linqjs from 'linqjs';

import 'jscatalyst/dist/jscatalyst.min.css';
import { ThemePlugin } from 'jscatalyst';

Vue.config.productionTip = false;
Vue.use(linqjs);
Vue.use(VueSocketio, 'http://localhost:9000');

Vue.use(ThemePlugin, {
  store,
  themes: ['Blue', 'Pink', 'Green', 'Brown', 'Red', 'Grey']
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
