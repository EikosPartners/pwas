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
        console.log(response);
        // const pieLinqData = new jslinq(response.data)
        //   .select(d => {
        //     console.log(d.severity);
        //     return {
        //       label: d.project,
        //       value: d.severity
        //     };
        //   })
        //   .groupBy(d => {
        //     return d.label;
        //   });

        // console.log('group by label', pieLinqData.items);

        // let data = pieLinqData.items.map(i => {
        //   return i;
        // });
        // console.log(data);

        // const finalData = [];

        // data.forEach(i => {
        //   console.log(i.elements);
        //   const sum = 0;
        //   i.elements.reduce((el, sum) => {
        //     return (el.value += sum);
        //   });
        //   finalData.push({
        //     label: i.key,
        //     value: sum
        //   });
        // });
        // console.log(finalData);

        const pieData = response.data.map(item => {
          return {
            label: item.project,
            value: item.severity
          };
        });

        commit('addData', pieData);
      });
    }
  }
});
