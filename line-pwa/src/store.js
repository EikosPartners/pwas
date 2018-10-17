import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { stat } from 'fs';

Vue.use(Vuex);

const state = {
  data: [],
  color: null,
  lighting: null,
  belongsToGrid: false,
  selected: "",
  filterOnGridID: null
};

export const mutations = {
  initializeData(state, payload) {
    state.data = payload;
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
  },
  setFilterOnGridID(state, data){
    state.filterOnGridID = data
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get('http://localhost:9000').then(res => {
      commit('initializeData', res.data);
    });
  },
  updateData({ commit }) {
    axios.get('http://localhost:9000/update').then(response => {
      commit('refreshData', response.data);
    });
  },
  fetchColor({ commit }) {
    axios.get('http://localhost:9000/color').then(res => {
      commit('setColor', res.data.color);
      commit('setLighting', res.data.lighting);
    });
  },
  changeTheme({ commit }, data) {
    commit('setColor', data);
  },
  setFilterOnGridID({commit}, data){
    commit("setFilterOnGridID", data)
  }
};

export const getters = {
  data: state => state.data,
  color: state => state.color,
  lighting: state => state.lighting,
  //  Date / Value data
  dataDV: state => {
    const modifiedData = [];
    state.data.forEach(datum => {
      const temp = {
        date: datum.date.split('T')[0],
        value: datum.severity
      };
      modifiedData.push(temp);
    });
    return modifiedData;
  },
  filterOnGridID: state => state.filterOnGridID
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
