import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import jslinq from 'jslinq';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: []
  },
  getters: {
    data: state => state.data
  },
  mutations: {
    addData(state, data) {
      state.data = data;
    }
  },
  actions: {
    fetchData({ commit }) {
      axios.get('http://localhost:9000').then(response => {
        console.log(response.data);
        commit('addData', response.data);
      });
    }
  }
});
