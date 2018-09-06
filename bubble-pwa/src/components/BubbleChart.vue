<template>
  <bubble-chart @jsc_click="filterByDate" :dataModel="prettyData" xAxisLabel="date" yAxisLabel="severity" :isTime='false' />
</template>

<script>
import { D3BubbleChart } from 'jscatalyst';
import { mapGetters } from 'vuex';
import jslinq from 'jslinq';

export default {
  name: 'BubbleChart',
  components: {
    bubbleChart: D3BubbleChart
  },
  computed: {
    ...mapGetters(['data']),
    prettyData() {
      console.log(this.$store.state.data);
      let bubbleData = new jslinq(this.data)
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
      return finalData;
    }
  },
  methods: {
    filterByDate(data) {
      console.log(data);
      let filter = {};
      filter.source = 'BubbleChart';
      filter.dataSource = '/';
      filter.data = data.x;
      console.log(filter);
      this.$socket.emit('filterByDate', filter);
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
    }
  }
};
</script>

<style>
</style>
