import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    fetchData(state, payload) {
      state.data = payload;
    }
  },
  actions: {
    fetchData({ commit }) {
      axios.get('http://localhost:9000').then(res => {
        console.log('log pwa', res);
        commit('fetchData', res.data);
      });
    }
  },
  getters: {
    data: state => state.data
  }
});
