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
        const pieData = response.data.map(item => {
          return {
            label: item.date,
            value: item.severity
          };
        });
        commit('addData', pieData);
      });
    }
  }
});
