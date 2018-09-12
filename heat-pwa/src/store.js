import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  data: [],
  color: null
};

export const getters = {
  data: state => state.data,
  color: state => state.color
};

export const mutations = {
  addData(state, data) {
    state.data = data;
  },
  addColor(state, data) {
    state.color = data;
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get('http://localhost:9000').then(response => {
      commit('addData', response.data);
    });
  },
  fetchColor({ commit }) {
    axios.get('http://localhost:9000/color').then(resp => {
      console.log(resp);
      commit('addColor', resp.data);
    });
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
