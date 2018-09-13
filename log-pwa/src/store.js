import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  data: []
};

export const mutations = {
  addData(state, payload) {
    state.data.unshift(payload);
  }
};

export const actions = {};

export const getters = {
  data: state => state.data
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
