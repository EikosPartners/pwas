import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import jslinq from 'jslinq';

Vue.use(Vuex);

const state = {
  data: [],
  color: null,
  lighting: null,
  belongsToGrid: false,
  selected: ''
};

export const getters = {
  data: state => state.data,
  color: state => state.color,
  lighting: state => state.lighting,
  belongsToGrid: state => state.belongsToGrid
};

export const mutations = {
  initializeData(state, data) {
    state.data = data;
  },
  refreshData(state, data) {
    const oldData = state.data;
    oldData.splice(0, 100);
    state.data = oldData.concat(data);
  },
  setColor(state, color) {
    state.color = color;
  },
  setLighting(state, lighting) {
    state.lighting = lighting;
  },
  setBelongsToGrid(state) {
    state.belongsToGrid = true;
  },
  setSelected(state, data) {
    state.selected = data
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get('http://localhost:9000').then(response => {
      commit('initializeData', response.data);
    });
  },
  updateData({ commit }) {
    axios.get('http://localhost:9000/update').then(response => {
      commit('refreshData', response.data);
    });
  },
  fetchColor({ commit }) {
    axios.get('http://localhost:9000/color').then(response => {
      commit('setColor', response.data.color);
      commit('setLighting', response.data.lighting);
    });
  },
  changeTheme({ commit }, data) {
    commit('setColor', data);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
