import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  data: []
};

export const getters = {
  data: state => state.data
};

export const mutations = {
  addData(state, data) {
    state.data = data;
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get("http://localhost:9000").then(response => {
      commit("addData", response.data);
    });
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
