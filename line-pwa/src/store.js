import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    initializeData(state, payload) {
      state.data = payload;
    }
  },
  actions: {
    initializeData({ commit }) {
      axios.get("http://localhost:9000").then(res => {
        console.log(res);
        commit("initializeData", res.data);
      });
    }
  },
  getters: {
    data: state => state.data,
    //  Date / Value data
    dataDV: state => {
      const modifiedData = [];
      state.data.forEach(datum => {
        const temp = {
          date: datum.date.split("T")[0],
          value: datum.severity
        };
        modifiedData.push(temp);
      });
      return modifiedData;
    }
  }
});
