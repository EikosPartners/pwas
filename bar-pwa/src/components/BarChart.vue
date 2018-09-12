<template>
  <div class="container">
    <bar-chart
      @jsc_click="filterByDate"
      :dataModel='barData'
      title='Number of Tickets by Date'
      xaxisLabel="Date"
      yaxisLabel="Number of Tickets"
      :xAxisAngle='0'
    ></bar-chart>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { D3BarChart, StyleTogglerMixin } from "jscatalyst";

export default {
  name: "BarChart",
  components: {
    barChart: D3BarChart
  },
  computed: {
    ...mapGetters(["data", "height"]),
    ...mapState(["color"]),
    barData() {
      const barData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { x: date, y: sorted[date] };
        barData.push(dataObj);
      }
      return barData;
    }
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
      filter.data = data.x;
      filter.time = new Date();
      this.$socket.emit("filterByDate", filter);
    },
    parseDate(date) {
      let dateA = date.split("T")[0].split("-");
      return dateA[1] + "-" + dateA[2] + "-" + dateA[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let date = this.parseDate(item.date);
        if (Object.keys(groupedData).includes(date)) {
          groupedData[date] += 1;
        } else {
          groupedData[date] = 1;
        }
      });
      return groupedData;
    }
  },
  mixins: [StyleTogglerMixin],
  watch: {
    color(newData) {
      if (newData) {
        this.$store.commit(this.color.action, this.color.color);
        console.log(this.$store.state.themeMod);
        if (this.$store.state.themeMod) {
          this.chooseTheme(this.$store.state.themeMod.colorTheme);
        }
      }
    }
  }
};
</script>
<style>
.container {
  width: 90%;
  padding: 0 5%;
  height: 90vh;
}
</style>
