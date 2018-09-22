import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  data: [],
  color: null,
  lighting: null
};

export const getters = { 
  data: state => state.data, 
  color: state => state.color, 
  lighting: state => state.lighting 
};

export const mutations = {
  addData(state, payload) {
    state.data.push(payload);
  },
  setColor(state, color) {
    state.color = color;
  },
  setLighting(state, lighting) {
    state.lighting = lighting;
  }
};

export const actions = { 
  fetchColor({ commit }) {
    axios.get("http://localhost:9000/color").then(response => {
      commit("setColor", response.data.color);
      commit("setLighting", response.data.lighting);
    });
  }, 
  changeTheme({ commit }, data) {
    commit("setColor", data);
  } 
};


export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
