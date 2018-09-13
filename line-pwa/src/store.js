import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  data: []
};

export const mutations = {
  initializeData(state, payload) {
    state.data = payload;
  },
  refreshData(state, data) {
    const oldData = state.data;
    oldData.splice(0, 100);
    state.data = oldData.concat(data);
  }
};

export const actions = {
  initializeData({ commit }) {
    axios.get("http://localhost:9000").then(res => {
      console.log(res);
      commit("initializeData", res.data);
    });
  },
  updateData({ commit }) {
    axios.get("http://localhost:9000/update").then(response => {
      commit("refreshData", response.data);
    });
  }
};

export const getters = {
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
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
