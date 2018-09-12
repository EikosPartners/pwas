import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  data: [],
  columns: [],
  currentFilter: "No Filter"
};

export const getters = {
  data: state => state.data,
  columns: state => state.columns,
  currentFilter: state => state.currentFilter
};

export const mutations = {
  addData(state, data) {
    state.data = data;
  },
  setCurrentFilter(state, data) {
    if (data) {
      state.currentFilter = data;
    } else {
      state.currentFilter = "No Filter";
    }
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
