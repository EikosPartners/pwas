<template>
<div style="height: 400px">

  <pie-chart :dataModel="data"/>
</div>
</template>

<script>
import { D3PieChart } from 'jscatalyst';
import { mapGetters } from 'vuex';
export default {
  name: 'PieChart',
  components: {
    pieChart: D3PieChart
  },
  computed: {
    ...mapGetters(['data'])
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
