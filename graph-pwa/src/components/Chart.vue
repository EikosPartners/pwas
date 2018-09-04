<template>
    <div style="height: 400px">
        <line-chart @jsc_click="filterByDate" title="Line Chart" :dataModel="dataDV"/>
    </div>
</template>

<script>
import { D3LineChart, D3HeatMap } from "jscatalyst";
import { mapGetters } from "vuex";

export default {
  name: "Chart",
  components: {
    lineChart: D3LineChart,
    heatMap: D3HeatMap
  },
  computed: {
    ...mapGetters(["dataDV"])
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  },
  methods: {
    filterByDate(data) {
      let filter = {};
      filter.source = "lineChart";
      filter.dataSource = "/";
      filter.data = this.formatDate(data.date);
      this.emitFilter(filter);
    },
    emitFilter: function(data) {
      this.$socket.emit("filterByDate", data);
    },
    formatDate(dateObj) {
      let date = new Date(dateObj);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style>
</style>
