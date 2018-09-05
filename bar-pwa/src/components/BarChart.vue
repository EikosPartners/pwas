<template>
  <div style="height: 400px">
    <bar-chart
      @jsc_click="filterByDate"
      :dataModel='data'
      title='D3 Bar Chart'
      xaxis-label="date"
      yaxis-label="volume"
    ></bar-chart>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { D3BarChart } from "jscatalyst";

export default {
  name: "",
  components: {
    barChart: D3BarChart
  },
  computed: {
    ...mapGetters(["data", "height"])
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  },
  methods: {
    filterByDate(data) {
      let filter = {};
      filter.source = "barChart";
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
