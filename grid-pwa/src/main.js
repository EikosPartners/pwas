import Vue from "vue";
import App from "./App.vue";
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import VueSocketio from "vue-socket.io";

Vue.config.productionTip = false;

Vue.use(VueSocketio, "http://localhost:9000");

new Vue({
  router,
  store,
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    customEmit: function(val) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    }
  },
  methods: {
    clickButton: function(val) {
      // $socket is socket.io-client instance
      this.$socket.emit("emit_method", val);
    }
  },
  render: h => h(App)
}).$mount("#app");
