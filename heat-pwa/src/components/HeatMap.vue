<template>
   <heat-map
      @jsc_click="sendFilter"
      :dataModel='data'
      title='D3 Heat Map'
      xaxis-label="date"
      yaxis-label="volume"
    ></heat-map>
</template>
<script>
import { mapGetters } from "vuex";
import { D3HeatMap } from "jscatalyst";

export default {
  name: "",
  components: {
    heatMap: D3HeatMap
  },
  computed: {
    ...mapGetters(["data"])
  },
  methods: {
    sendFilter(data) {
      console.log(data.date);
      let filterData = {};
      filterData.source = "heatMap";
      filterData.dataSource = "/";
      filterData.data = data.date;
      console.log(filterData);
      this.bc.postMessage(filterData);
    }
  }
};
</script>
<style>
</style>
