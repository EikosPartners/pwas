<template>
<div>
  <ag-grid-vue
    id='Grid'
    style='width: 100%; height: 500px'
    class='ag-theme-balham'
    :columnDefs='columns'
    :rowData='prettyData'
    :enableSorting='true'
    :enableFilter='true'
    :gridReady='onGridReady'
    rowSelection='multiple'
  ></ag-grid-vue>
  <button @click="removeQuickFilter">Clear Filter</button>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { AgGridVue } from "ag-grid-vue";

export default {
  name: "Grid",
  components: {
    AgGridVue
  },
  computed: {
    ...mapGetters(["data", "columns"]),
    prettyData() {
      return this.data.map(item => {
        item.date = this.parseDate(item.date);
        console.log(item);
        return item;
      });
    }
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$options.sockets.filterByDate = filter => {
        console.log(filter);
        this.setQuickFilter(filter.data);
      };
    }
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
    },
    setQuickFilter(data) {
      if (this.gridApi) {
        this.gridApi.setQuickFilter(data);
      }
    },
    removeQuickFilter() {
      if (this.gridApi) {
        this.gridApi.setQuickFilter(null);
      }
    },
    parseDate(date) {
      let dateA = date.split("T")[0].split("-");
      let timeA = date.split("T")[1].split(".");
      let hms = timeA[0].split(":").join(" ");
      return dateA[1] + "-" + dateA[2] + "-" + dateA[0] + " : " + hms;
    }
  }
};
</script>
<style>
</style>
