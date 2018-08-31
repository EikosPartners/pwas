<template>
    <div style="height: 400px">
        <line-chart title="Line Chart" :dataModel="dataDV"/>
    </div>
</template>

<script>
import { D3LineChart, D3HeatMap } from 'jscatalyst';
import { mapGetters } from 'vuex';

export default {
  name: 'Chart',
  components: {
    lineChart: D3LineChart,
    heatMap: D3HeatMap
  },
  computed: {
    ...mapGetters(['dataDV'])
  }
};
</script>

<style>
</style>
