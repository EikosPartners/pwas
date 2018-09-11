<template>
  <div style="height: 500px">
    <bar-chart
      @jsc_click="filterByDate"
      :dataModel='barData'
      title='D3 Bar Chart'
      xaxisLabel="Date"
      yaxisLabel="Number of Tickets"
    ></bar-chart>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { D3BarChart, StyleTogglerMixin } from 'jscatalyst';

export default {
  name: 'BarChart',
  components: {
    barChart: D3BarChart
  },
  computed: {
    ...mapGetters(['data', 'height']),
    barData() {
      const barData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { x: date, y: sorted[date] };
        barData.push(dataObj);
      }
      return barData;
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
    }
  },
  methods: {
    filterByDate(data) {
      let filter = {};
      filter.source = 'barChart';
      filter.dataSource = '/';
      filter.data = data.x;
      this.$socket.emit('filterByDate', filter);
    },
    parseDate(date) {
      let dateA = date.split('T')[0].split('-');
      return dateA[1] + '-' + dateA[2] + '-' + dateA[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let date = this.parseDate(item.date);
        if (Object.keys(groupedData).includes(date)) {
          groupedData[date] += 1;
        } else {
          groupedData[date] = 1;
        }
      });
      return groupedData;
    }
  }
};
</script>
<style>
</style>
