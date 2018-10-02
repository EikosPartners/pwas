<template>
  <bar-chart
    v-if="this.data != null"
    :dataModel='prettyData'
    xaxisLabel="Application"
    yaxisLabel="Number of Actions"
    :xAxisAngle='45'
  />
</template>

<script>
import {mapState} from 'vuex'
import {D3BarChart, StyleTogglerMixin} from 'jscatalyst'
import jslinq from 'jslinq'
export default {
  name:'BarChart',
  mixins:[StyleTogglerMixin],
  components:{
    barChart: D3BarChart
  },
  computed:{
    ...mapState(['data']),
    prettyData(){
      const linqData = new jslinq(this.data)
        .select(d => {
          return {
            x: d.application,
            y: d.element.data
          };
        })
        .groupBy(d => {
          return d.x;
        })
        .select(d => {
          return { x: d.key, y: d.count };
        });
      return linqData.items;
    }
  }
}
</script>

<style>

</style>
