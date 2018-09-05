import Vue from 'vue';
import Router from 'vue-router';
import PieChart from './components/PieChart.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'PieChart',
      component: PieChart
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
