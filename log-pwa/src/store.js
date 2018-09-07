import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  data: []
};

export const mutations = {
  addData(state, payload) {
    state.data = payload;
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get("http://localhost:9000").then(res => {
      console.log("log pwa", res);
      commit("addData", res.data);
    });
  }
};

export const getters = {
  data: state => state.data
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
