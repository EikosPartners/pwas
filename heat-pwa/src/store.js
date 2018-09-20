import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  data: [],
  color: null,
  belongsToGrid: false
};

export const getters = {
  data: state => state.data,
  color: state => state.color,
  belongsToGrid: state => state.belongsToGrid
};

export const mutations = {
  initializeData(state, data) {
    state.data = data;
  },
  addColor(state, data) {
    state.color = data;
    debugger
  },
  refreshData(state, data) {
    const oldData = state.data;
    oldData.splice(0, 100);
    state.data = oldData.concat(data);
  },
  setBelongsToGrid(state) {
    state.belongsToGrid = true    
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
    axios.get('http://localhost:9000/color').then(resp => {
      console.log(resp);
      commit('addColor', resp.data.color);
    });
  },
  changeTheme({ commit }, data) {
    commit('addColor', data);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
