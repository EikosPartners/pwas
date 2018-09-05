import Vue from 'vue';
import Router from 'vue-router';
import BubbleChart from './components/BubbleChart.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'BubbleChart',
      component: BubbleChart
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
