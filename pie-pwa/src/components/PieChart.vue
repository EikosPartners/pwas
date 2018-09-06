<template>
<div style="height: 400px">

  <pie-chart :dataModel="prettyData" @jsc_click="filterByProject"/>
</div>
</template>

<script>
import { D3PieChart } from 'jscatalyst';
import { mapGetters } from 'vuex';
import jslinq from 'jslinq';

export default {
  name: 'PieChart',
  components: {
    pieChart: D3PieChart
  },
  computed: {
    ...mapGetters(['data']),
    prettyData() {
      const pieLinqData = new jslinq(this.data)
        .select(d => {
          return {
            label: d.project,
            value: d.severity
          };
        })
        .groupBy(d => {
          return d.label;
        });
      let temp = pieLinqData.items.map(i => {
        return i;
      });
      const finalData = [];
      temp.forEach(i => {
        let sum = 0;
        i.elements.forEach(el => {
          return (sum += el.value);
        });
        finalData.push({
          label: i.key,
          value: sum
        });
      });
      return finalData;
    }
  },
  methods: {
    filterByProject(data) {
      console.log(data);
      let filter = {};
      filter.source = 'PieChart';
      filter.dataSource = '/';
      filter.data = data.data.label;
      console.log(filter);
      this.$socket.emit('filterByProject', filter);
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
