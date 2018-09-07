import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  data: [],
  columns: []
};

export const getters = {
  data: state => state.data,
  columns: state => state.columns
};

export const mutations = {
  addData(state, data) {
    state.data = data;
  },
  generateColumns(state, data) {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      state.columns = keys.map(key => {
        return { headerName: key, field: key };
      });
    } else {
      state.columns = [];
    }
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get("http://localhost:9000").then(response => {
      commit("addData", response.data);
      commit("generateColumns", response.data);
    });
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
