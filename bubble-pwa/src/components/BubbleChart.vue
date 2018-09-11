<template>
  <bubble-chart :isDate="true" @jsc_click="filterByDateAndSeverity" :dataModel="prettyData" xAxisLabel="date" yAxisLabel="severity"  />
</template>

<script>
import { D3BubbleChart, StyleTogglerMixin } from 'jscatalyst';
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
      let bubbleData = new jslinq(this.data)
        .select(item => {
          // console.log(item);
          let date = item.date.split('T')[0];
          return {
            date,
            severity: item.severity
          };
        })
        .groupBy(i => {
          // console.log(i);
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
      let finalData = [];
      bubbleData.items.forEach(set => {
        set.key.forEach(k => {
          finalData.push({
            x: k[0].date,
            y: k.key,
            value: k.length,
            label: 'Date/severity'
          });
        });
      });
      return finalData;
    }
  },
  methods: {
    filterByDateAndSeverity(data) {
      let filter = {};
      filter.source = 'BubbleChart';
      filter.dataSource = '/';
      filter.data = { date: this.parseDate(data.x), severity: data.y };
      console.log(filter);
      this.$socket.emit('filterByDateAndSeverity', filter);
    },
    parseDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return month + '-' + day + '-' + year;
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
    }
  },
  mixins: [StyleTogglerMixin],
  created() {
    this.$store.commit('changeColor', 'Pink');
    console.log(this.$store.state.themeMod);
    if (this.$store.state.themeMod) {
      this.chooseTheme(this.$store.state.themeMod.colorTheme);
    }
  }
};
</script>

<style>
</style>
