import "jscatalyst/dist/jscatalyst.min.css";
import Vue from "vue";
import Vuetify from "vuetify";
import { ThemePlugin } from "jscatalyst";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketio from "vue-socket.io";

import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.use(VueSocketio, "http://localhost:9000");
Vue.use(Vuetify);
Vue.use(ThemePlugin, {
  store,
  themes: ["Blue", "Pink", "Green", "Brown", "Red", "Grey"]
});

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
