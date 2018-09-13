import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import jslinq from "jslinq";

Vue.use(Vuex);

const state = {
  data: []
};

export const getters = {
  data: state => state.data
};

export const mutations = {
  initializeData(state, data) {
    state.data = data;
  },
  refreshData(state, data) {
    const oldData = state.data;
    oldData.splice(0, 100);
    state.data = oldData.concat(data);
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get("http://localhost:9000").then(response => {
      commit("initializeData", response.data);
    });
  },
  updateData({ commit }) {
    axios.get("http://localhost:9000/update").then(response => {
      commit("refreshData", response.data);
    });
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
