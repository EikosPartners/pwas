<template>
<div class="container">
  <div class="header">
    <span>Grid</span>
    <span class="current-filter">{{currentFilter}}</span>
    <button @click="removeFilter">Clear Filter</button>
    </div>
  <ag-grid-vue
    id='Grid'
    class='ag-theme-balham grid'
    :columnDefs='columns'
    :rowData='prettyData()'
    :enableSorting='true'
    :enableFilter='true'
    :gridReady='onGridReady'
    rowSelection='multiple'
  ></ag-grid-vue>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { AgGridVue } from "ag-grid-vue";

export default {
  name: "Grid",
  components: {
    AgGridVue
  },
  computed: {
    ...mapGetters(["data", "columns", "currentFilter"])
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$options.sockets.refresh = () => {
        console.log("refresh!");
        this.updateData();
      };
      this.$options.sockets.filterByDate = filter => {
        console.log("filter", filter);
        this.removeFilter();
        this.setQuickFilter(filter.data);
        let source = this.formatSource(filter.source);
        this.setCurrentFilter(source);
      };
      this.$options.sockets.filterByProject = filter => {
        console.log("filter", filter);
        this.removeFilter();
        this.setQuickFilter(filter.data);
        let source = this.formatSource(filter.source);
        this.setCurrentFilter(source);
      };
      this.$options.sockets.filterBySeverity = filter => {
        console.log("filter", filter);
        this.removeFilter();
        this.setQuickFilter(filter.data);
        let source = this.formatSource(filter.source);
        this.setCurrentFilter(source);
      };
      this.$options.sockets.filterByRaisedBy = filter => {
        console.log("filter", filter);
        this.removeFilter();
        this.setQuickFilter(filter.data);
        let source = this.formatSource(filter.source);
        this.setCurrentFilter(source);
      };
      this.$options.sockets.filterByDateAndSeverity = filter => {
        console.log("filter", filter);
        this.removeFilter();
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
        let source = this.formatSource(filter.source);
        this.setCurrentFilter(source);
      };
    }
  },
  methods: {
    ...mapMutations(["setCurrentFilter"]),
    ...mapActions(["updateData"]),
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
      window.addEventListener("resize", () => {
        this.gridApi.sizeColumnsToFit();
      });
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
        this.setCurrentFilter(null);
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
    },
    formatSource(sourceApp) {
      let withSpaces = sourceApp.replace(/([A-Z])/g, " $1");
      return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }
  }
};
</script>
<style>
.header {
  background: rgb(66, 184, 221);
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container {
  width: 100%;
  height: 95vh;
  overflow: hidden;
}

.current-filter {
  padding: 0 0 0 20rem;
  font-size: 0.6em;
}

.grid {
  width: 100%;
  height: 85%;
}

button {
  margin: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-family: inherit;
  font-size: 1.1rem;
  background: rgb(220, 220, 220);
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(0, 0, 0, 0.3);
}

button:focus {
  outline: 0;
}
</style>