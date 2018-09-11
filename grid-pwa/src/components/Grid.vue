<template>
<div style="width: 100%;">
  <ag-grid-vue
    id='Grid'
    style='width: 100%; height: 500px'
    class='ag-theme-balham'
    :columnDefs='columns'
    :rowData='prettyData()'
    :enableSorting='true'
    :enableFilter='true'
    :gridReady='onGridReady'
    rowSelection='multiple'
  ></ag-grid-vue>
  <button @click="removeFilter">Clear Filter</button>
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
    ...mapGetters(["data", "columns"])
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$options.sockets.filterByDate = filter => {
        console.log("filter", filter);
        this.setQuickFilter(filter.data);
      };
      this.$options.sockets.filterByProject = filter => {
        console.log("filter", filter);
        this.setQuickFilter(filter.data);
      };
      this.$options.sockets.filterBySeverity = filter => {
        console.log("filter", filter);
        this.setQuickFilter(filter.data);
      };
      this.$options.sockets.filterByRaisedBy = filter => {
        console.log("filter", filter);
        this.setQuickFilter(filter.data);
      };
      this.$options.sockets.filterByDateAndSeverity = filter => {
        console.log("filter", filter);
        let filterInstanceOne = this.gridApi.getFilterInstance("date");
        let filterInstanceTwo = this.gridApi.getFilterInstance("severity");

        let modelOne = filterInstanceOne.setModel({
          type: "contains",
          filter: filter.data.date
        });
        let modelTwo = filterInstanceTwo.setModel({
          type: "contains",
          filter: filter.data.severity
        });
        filterInstanceOne.onFilterChanged();
        filterInstanceTwo.onFilterChanged();
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
    removeFilter() {
      if (this.gridApi) {
        this.gridApi.setQuickFilter(null);
        this.gridApi.setFilterModel(null);
      }
    },
    prettyData() {
      return this.data.map(item => {
        let prettyItem = {};
        prettyItem.date = this.parseDate(item.date);
        prettyItem.project = item.project;
        prettyItem.raisedBy = item.raisedBy;
        prettyItem.severity = item.severity;
        return prettyItem;
      });
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