<template>
  <bubble-chart :dataModel="data" xAxisLabel="date" yAxisLabel="severity" :isTime='false' />
</template>

<script>
import { D3BubbleChart } from 'jscatalyst';
import { mapGetters } from 'vuex';
export default {
  name: 'BubbleChart',
  components: {
    bubbleChart: D3BubbleChart
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

<style>
</style>
