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
  filterOnGridID: null,
  contextFilter: {source: "LineChart", dataSource: "/"},
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
  },
  setContextFilterData(state, data){
    state.contextFilter.data = data
    state.contextFilter.date = new Date()
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
  },
  setContextFilterData({commit}, data){
    commit('setContextFilterData', data)

  }
};

export const getters = {
  data: state => state.data,
  color: state => state.color,
  lighting: state => state.lighting,
  //  Date / Value data
  dataDV: state => state.data,
  filterOnGridID: state => state.filterOnGridID,
  contextFilter: state => state.contextFilter
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
