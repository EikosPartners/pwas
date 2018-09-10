<template>
  <bubble-chart :isDate="true" @jsc_click="filterByDate" :dataModel="prettyData" xAxisLabel="date" yAxisLabel="severity"  />
</template>

<script>
import { D3BubbleChart } from "jscatalyst";
import { mapGetters } from "vuex";
import jslinq from "jslinq";

export default {
  name: "BubbleChart",
  components: {
    bubbleChart: D3BubbleChart
  },
  computed: {
    ...mapGetters(["data"]),
    prettyData() {
      let bubbleData = new jslinq(this.data)
        .select(item => {
          let date = item.date.split("T")[0];
          return {
            date,
            severity: item.severity
          };
        })
        .groupBy(i => {
          return i.date;
        })
        .groupBy(i => {
          let groupedSeverity = i.elements.groupBy(k => {
            return k.severity;
          });
          return groupedSeverity;
        })
        .orderByDescending(i => {
          return i.key;
        });
      let finalData = [];
      bubbleData.items.forEach(set => {
        set.key.forEach(k => {
          finalData.push({
            x: k[0].date,
            y: k.key,
            value: k.length,
            label: "Date/severity"
          });
        });
      });
      return finalData;
    }
  },
  methods: {
    filterByDate(data) {
      let filter = {};
      filter.source = "BubbleChart";
      filter.dataSource = "/";
      filter.data = this.parseDate(data.x);
      console.log(filter);
      this.$socket.emit("filterByDate", filter);
    },
    parseDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();

      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return month + "-" + day + "-" + year;
    }
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  }
};
</script>

<style>
</style>
