import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export const state = {
  color: null,
  lighting: null
};
export const getters = {
  color: state => state.color,
  lighting: state => state.lighting
};
export const mutations = {
  setColor(state, color) {
    state.color = color;
  },
  setLighting(state, lighting) {
    state.lighting = lighting;
  }
};
export const actions = {
  fetchColor({ commit }) {
    axios.get('http://localhost:9000/color').then(resp => {
      commit('setColor', resp.data.color);
      commit('setLighting', resp.data.lighting);
    });
  }
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
