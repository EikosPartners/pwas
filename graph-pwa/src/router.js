import Vue from 'vue';
import Router from 'vue-router';
import Chart from './components/Chart.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'chart',
      component: Chart
    }
  ]
});
