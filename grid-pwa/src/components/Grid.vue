<template>
  <div>
    <h1>GRID</h1>
    <ag-grid-vue
      id='Grid'
      style='width: 100%; height: 500px'
      class='ag-theme-balham'
      :columnDefs='columns'
      :rowData='data'
      :enableSorting='true'
      :enableFilter='true'
      :gridReady='onGridReady'
      rowSelection='multiple'
    ></ag-grid-vue>
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
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
    },
    setQuickFilter(data) {
      if (this.gridApi) {
        this.gridApi.setQuickFilter(data.date);
      }
    },
    removeQuickFilter() {
      if (this.gridApi) {
        this.gridApi.setQuickFilter(null);
      }
    }
  }
};
</script>
<style>
</style>
