<template>
  <div class="grid-container">
    <ag-grid-vue
      id='Grid'
      class="grid ag-theme-material"
      :columnDefs='columns'
      :rowData='rowData'
      :rowHeight='48'
      :enableColResize="true"
      :enableSorting='trueVar'
      :enableFilter='trueVar'
      :gridReady='onGridReady'
      rowSelection='multiple'
    ></ag-grid-vue>
  </div>
  <!-- 
    <div class="context-detail" v-html="jsonString"></div>
    -->
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import { AgGridVue } from "ag-grid-vue";
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
import JSONtoHTML from '@/mixins/JSONtoHTML'

export default {
  name: 'FilteredGridDetail',
  components: {
    AgGridVue
  },
  mixins: [Messaging, Windowing, StyleTogglerMixin, JSONtoHTML],
  props: ['contextName'],
  data() {
    return {
      ctxInfo: {},
      contextKey: null,
      trueVar: true
    }
  },
  computed: {
    columns() {
      if (this.ctxInfo.filter && this.ctxInfo.filter.data.length > 0) {
        const keys = Object.keys(this.ctxInfo.filter.data[0]);
        // this is so doesn't show id - do we want?
        const i = keys.indexOf('id');
        keys.splice(i, 1);

        let cols = keys.map(key => {
          return {
            headerName: `${key}`,
            field: `${key}`
          };
        });
        console.log("cols", cols)
        return cols
      } else {
        return [];
      }
    },
    rowData() {
      if (this.ctxInfo.filter && this.ctxInfo.filter.data.length > 0) {
        return this.ctxInfo.filter.data
      } else {
        return []
      }
    }
  },
  methods: {
    toggleClicked() {
      this.clicked = !this.clicked
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
      window.addEventListener("resize", () => {
        this.gridApi.sizeColumnsToFit();
      });
    }
  },
  created() {
    this.contextKey = this.subscribe(this.contextName, (context, delta, removed) => {
    this.ctxInfo = context;
    console.log("info", this.contextName)
    console.log("info", this.ctxInfo)
    });
  }
}
</script>

<style scoped>
  .context-detail {
  margin-left: 3rem;
  font-size: 1.2rem;
  display:flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.grid-container {
  width: 80vw;
  /* overflow: hidden; */
}

.grid {
  width: 80vw;
  height: 50vh;
}

.ag-theme-dark {
  font-family: Roboto, sans-serif !important;
}

.theme--dark .ag-theme-material {
  background-color: #303030 !important;;
  color: white;
}
.theme--dark .ag-header {
  color: white;
}
.header-button {
  color: black !important;
}

.theme--dark .ag-row-hover {
  color: black;
}
</style>

