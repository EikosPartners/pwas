import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: []
  },
  getters: {
    data: state => state.data
  },
  mutations: {
    addData(state, data) {
      state.data = data;
    }
  },
  actions: {
    fetchData({ commit }) {
      axios.get("http://localhost:9000").then(response => {
        const heatData = response.data.map(item => {
          console.log(typeof item.date);
          return {
            date: item.date.split("T")[0],
            volume: item.severity
          };
        });
        commit("addData", heatData);
      });
    }
  }
});
