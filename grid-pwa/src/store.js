import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: [],
    columns: []
  },
  getters: {
    data: state => state.data,
    columns: state => state.columns
  },
  mutations: {
    addData(state, data) {
      state.data = data;
    },
    generateColumns(state, data) {
      const keys = Object.keys(data[0]);
      state.columns = keys.map(key => {
        return { headerName: key, field: key };
      });
    }
  },
  actions: {
    fetchData({ commit }) {
      axios.get("http://localhost:9000").then(response => {
        commit("addData", response.data);
        commit("generateColumns", response.data);
      });
    }
  }
});
