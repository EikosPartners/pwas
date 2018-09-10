import Vue from "vue";
import Router from "vue-router";
import LineChart from "./components/LineChart.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "LineChart",
      component: LineChart
    }
  ]
});
