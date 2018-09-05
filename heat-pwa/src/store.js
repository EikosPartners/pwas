import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: [],
    columns: []
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
        const heatData = response.data.map(item => {
          return {
            date: item.date,
            volume: item.severity
          };
        });
        commit('addData', heatData);
      });
    }
  }
});
