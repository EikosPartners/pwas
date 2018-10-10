import Vue from "vue";
import Router from "vue-router";
// import Container from "./components/Container.vue";
// const Container = () => import ('./components/Container.vue')
import LoadingComponent from './components/LoadingComponent.vue'

const Container = () => ({
  // The component to load (should be a Promise)
  component: import('./components/Container.vue'),
  // A component to use while the async component is loading
  loading: LoadingComponent,
  // A component to use if the load fails
  error: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 0,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 0
})
 
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Container",
      component: Container
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
