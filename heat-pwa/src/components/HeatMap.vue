<template>
   <heat-map
      @jsc_click="filterByDate"
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
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  },
  methods: {
    filterByDate(data) {
      let filter = {};
      filter.source = "heatMap";
      filter.dataSource = "/";
      filter.data = data.date;
      console.log(filter);
      this.$socket.emit("filterByDate", filter);
    }
  }
};
</script>
<style>
</style>
