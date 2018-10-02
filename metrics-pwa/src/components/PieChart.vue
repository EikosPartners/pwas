<template>
  <pie-chart
    v-if="this.data != null"
    :dataModel="prettyData"  
  />
</template>

<script>
import {mapState} from 'vuex'
import {D3PieChart, StyleTogglerMixin} from 'jscatalyst'
import jslinq from 'jslinq'
export default {
  name: "PieChart",
  mixins:[StyleTogglerMixin],
  components:{
    pieChart: D3PieChart
  },
  computed:{
    ...mapState(['data']),
    prettyData() {
      const pieLinqData = new jslinq(this.data)
        .select(d => {
          return {
            label: d.application,
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
        finalData.push({
          label: i.key,
          value: i.count
        });
      });
      return finalData;
    },
  }


}
</script>

<style>

</style>
