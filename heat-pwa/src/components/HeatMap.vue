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
  name: "HeatMap",
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
      filter.data = this.parseDate(data.date);
      console.log(filter);
      this.$socket.emit("filterByDate", filter);
    },
    parseDate(date) {
      const dateArray = date.split("-");
      return dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0];
    }
  }
};
</script>
<style>
</style>
