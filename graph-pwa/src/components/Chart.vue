<template>
    <div >
        <line-chart title="hello" :dataModel="data"></line-chart>
    </div>
</template>

<script>
import { D3LineChart } from 'jscatalyst';
import { mapGetters } from 'vuex';

export default {
  name: 'Chart',
  components: {
    lineChart: D3LineChart
  },
  computed: {
    ...mapGetters(['data'])
  }
};
</script>

<style>
</style>
