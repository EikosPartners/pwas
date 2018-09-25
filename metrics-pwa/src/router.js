import Vue from "vue";
import Router from "vue-router";
import Grid from "./components/Grid.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Grid",
      component: Grid
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
