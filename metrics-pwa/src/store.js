import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  data: [],
  columns: [],
  currentFilter: 'No Filter',
  contextId: null,
  color: null,
  lighting: null
};

export const getters = {
  data: state => state.data,
  columns: state => state.columns,
  currentFilter: state => state.currentFilter,
  color: state => state.color,
  lighting: state => state.lighting
};

export const mutations = {
  initializeData(state, data) {
    state.data = data;
  },
  setCurrentFilter(state, data) {
    if (data) {
      state.currentFilter = data;
    } else {
      state.currentFilter = 'No Filter';
    }
  },
  setColor(state, color) {
    state.color = color;
  },
  setLighting(state, lighting) {
    console.log(lighting);
    state.lighting = lighting;
  },
  generateColumns(state, data) {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      const i = keys.indexOf('id');
      keys.splice(i, 1);
      state.columns = keys.map(key => {
        return {
          headerName: key,
          field: key,
          filterParams: {
            newRowsAction: 'keep'
          }
        };
      });
    } else {
      state.columns = [];
    }
  },
  refreshData(state, data) {
    const oldData = state.data;
    oldData.splice(0, 100);
    state.data = oldData.concat(data);
  },
  setContextId(state, data) {
    if (state.contextId === null) {
      state.contextId = data;
    }
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get('http://localhost:9000/metrics').then(response => {
      commit('initializeData', response.data);
      commit('generateColumns', response.data);
    });
  },
  updateData({ commit }) {
    axios.get('http://localhost:9000/metrics').then(response => {
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
  },
  changeLighting({ commit }, data) {
    commit('setLighting', data);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
