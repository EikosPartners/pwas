import Vue from "vue";
import Router from "vue-router";
import BarChart from "./components/BarChart.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "BarChart",
      component: BarChart
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
