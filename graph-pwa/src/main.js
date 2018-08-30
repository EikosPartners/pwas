import 'jscatalyst/dist/jscatalyst.min.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import { ThemePlugin } from 'jscatalyst';
import App from './App.vue';
import router from './router';
import store from './store';

import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(ThemePlugin, {
  store,
  themes: ['Blue', 'Pink', 'Green', 'Brown', 'Red', 'Grey']
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
