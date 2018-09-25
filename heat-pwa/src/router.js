import Vue from "vue";
import Router from "vue-router";
import HeatMap from "./components/HeatMap.vue";

/*
const HeatMap = () => ({
  component: import("./components/HeatMap.vue"),
  //loading: AwesomeSpinner
});
*/

Vue.use(Router);


export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "HeatMap",
      component: HeatMap
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
