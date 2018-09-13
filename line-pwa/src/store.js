import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  data: [],
  color: null
};

export const mutations = {
  fetchData(state, payload) {
    state.data = payload;
  },
  refreshData(state, data) {
    const oldData = state.data;
    oldData.splice(0, 100);
    state.data = oldData.concat(data);
  },
  fetchColor(state, data) {
    state.color = data;
  }
};

export const actions = {
  fetchData({ commit }) {
    axios.get('http://localhost:9000').then(res => {
      console.log(res);
      commit('fetchData', res.data);
    });
  },
  updateData({ commit }) {
    axios.get('http://localhost:9000/update').then(response => {
      commit('refreshData', response.data);
    });
  },
  fetchColor({ commit }) {
    axios.get('http://localhost:9000/color').then(res => {
      commit('fetchColor', res.data);
    });
  }
};

export const getters = {
  data: state => state.data,
  color: state => state.color,
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
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
