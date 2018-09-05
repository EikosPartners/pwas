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
        let bubbleData = new jslinq(response.data)
          .select(item => {
            let date = item.date.split('T')[0];
            return {
              date,
              severity: item.severity
            };
          })
          .groupBy(i => {
            return i.date;
          })
          .groupBy(i => {
            let groupedSeverity = i.elements.groupBy(k => {
              return k.severity;
            });
            return groupedSeverity;
          })
          .orderByDescending(i => {
            return i.key;
          });

        console.log('bubble data', bubbleData.items);
        let finalData = [];
        bubbleData.items.forEach(set => {
          set.key.forEach(k => {
            finalData.push({
              x: finalData.length,
              y: k.key,
              value: k.length,
              label: 'Date/severity'
            });
          });
          // console.log('DateData', dateData);
          // dateData.forEach(i => {
          //   finalData.push(i);
          // });
          console.log('Final Data', finalData);
        });

        // const bubbleData = response.data.map(item => {

        //   return {
        //     x: item.date,
        //     y: item.severity
        //   };
        // });
        commit('addData', finalData);
      });
    }
  }
});
