import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    initializeData(state, payload) {
      console.log('mut log', payload);
      Object.assign(state.data, payload);
    }
  },
  actions: {
    initializeData({ commit }) {
      axios.get('http://localhost:9000').then(res => {
        console.log(res);
        commit('initializeData', res.data);
      });
    }
  },
  getters: {
    data: state => state.data
  }
});
