<template>
<div class="container">
   <heat-map
      @jsc_click="filterByDate"
      :dataModel='heatData'
      title='Number of Tickets by Date'
      xaxis-label="date"
      yaxis-label="volume"
    ></heat-map>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { D3HeatMap, StyleTogglerMixin } from "jscatalyst";

export default {
  name: "HeatMap",
  components: {
    heatMap: D3HeatMap
  },
  computed: {
    ...mapGetters(["data"]),
    heatData() {
      const heatData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { date: date, volume: sorted[date] };
        heatData.push(dataObj);
      }
      return heatData;
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
      filter.source = "heatMap";
      filter.dataSource = "/";
      filter.data = this.parseDate(data.date);
      console.log(filter);
      this.$socket.emit("filterByDate", filter);
    },
    parseDate(date) {
      const dateArray = date.split("-");
      return dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let justDate = item.date.split("T");
        let date = justDate[0];
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
  created() {
    this.$store.commit("changeColor", "Blue");
    console.log(this.$store.state.themeMod);
    if (this.$store.state.themeMod) {
      this.chooseTheme(this.$store.state.themeMod.colorTheme);
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
