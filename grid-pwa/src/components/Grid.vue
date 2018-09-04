<template>
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
      this.$options.sockets.emitFilter = data => {
        console.log(data);
        this.setQuickFilter(data.data);
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
    }
  }
};
</script>
<style>
</style>
