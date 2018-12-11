<template>
<div class="container" >
  <div :class="['header']" :style="styleObject">
    <span>Grid</span>
     <span class="current-context" @dragstart="handleDragStart" @dragend="handleDragEnd" draggable="true">Id: {{contextId}}</span>
    <span class="current-filter">{{currentFilter}}</span>
    <button class="header-button" @click="removeFilter" :disabled="currentFilter === 'No Filter' || isContext">Clear Filter</button>
    <select class="select" v-model="selected">
      <option disabled value="">Select chart</option>
      <option value="JSCBar">BarChart</option>
      <option value="JSCBubble">Bubble Chart</option>
      <option value="JSCHeatMap">Heat Map</option>
      <option value="JSCLine">Line Chart</option>
      <option value="JSCPie">Pie Chart</option>
    </select>
     <button class="header-button" @click="openNewChart" :disabled="selected === '' || isContext">Open</button>
  </div>
    <ag-grid-vue v-if="prettyData"
      id='Grid'
      class="grid ag-theme-material"
      :columnDefs='columns'
      :rowData='prettyData'
      :rowHeight='48'
      :enableSorting='trueVar'
      :enableFilter='trueVar'
      :modelUpdated="modelUpdated"
      :gridReady='onGridReady'
      :filterChanged='updateChildren'
      rowSelection='multiple'
    ></ag-grid-vue>
</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AgGridVue } from "ag-grid-vue";
import { D3PieChart, StyleTogglerMixin } from 'jscatalyst';
// import Messaging from "@/mixins/Messaging";
import Windowing from "@/mixins/Windowing";
import DragAndDrop from "@/mixins/DragAndDrop"
import Stream from "@/mixins/Stream"
import jslinq from "jslinq";
import axios from 'axios'
export default {
  name: "Grid",
  components: {
    AgGridVue,
    pieChart: D3PieChart
  },
  mixins: [Windowing, StyleTogglerMixin, DragAndDrop, Stream],
  created(){
    this.subscribeToStream()
  },
  computed: {
    ...mapState([
      "data",
      "columns",
      "currentFilter",
      "contextId",
      "color",
      "lighting",
      "childContexts"
    ]),
    prettyData() {
      if (this.data) {
        debugger
        return this.data.map(item => {
          if (item.date) {
            //formats our data
            let prettyItem = {};
            prettyItem.date = this.parseDate(item.date);
            prettyItem.project = item.project;
            prettyItem.raisedBy = item.raisedBy;
            prettyItem.severity = item.severity;
            prettyItem.id = item.id;
            return prettyItem;
          } else {
            // if the data is not as expected
            return item
          }
        });
      }
    },
    styleObject() {
      if (this.lighting === "dark") {
        return {
          backgroundColor: this.$store.getters.themeColors.vuetifyDark,
          color: "#fff"
        };
      } else {
        return {
          backgroundColor: this.$store.getters.themeColors.vuetifyLight,
          color: "#000"
        };
      }
    }
  },
  data() {
    return {
      trueVar: true,
      selected: "",
      isGlu: window.glue,
      // temporaryWindow: null,
      temporaryData: null,
      isContext: window.context
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    themeColor: function(data) {
      if (!window.glue) {
        this.changeTheme(data.name.toLowerCase());
      }
    },
    themeLighting() {
      if (!window.glue) {
        this.toggleDark();
      }
    },
    refresh(data) {
      console.log("refresh!");
      this.updateData();
    },
    getNewChartInfo(data){
      // for children of grid 
      this.handleNewChartInfo(data)
    }
  },
  methods: {
    ...mapMutations(["setCurrentFilter"]),
    ...mapActions([
      "updateData",
      "fetchColor",
      "changeTheme",
      "changeLighting",
      "initializeData"
    ]),
    modelUpdated(params) {
      this.gridApi = params.api;
      console.log('update model')
      if (window.glue) {
        this.updateChildren();
      }
    },
    updateChildren() {
      this.handleUpdateChildren()
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.gridApi.sizeColumnsToFit();
      window.addEventListener("resize", () => {
        this.gridApi.sizeColumnsToFit();
      });
      this.handleGridReadyContext()
  
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
    openNewChart() {
      // Get the data set from this component
      // let filter = this.getFilteredData(); 
      this.temporaryData = this.getFilteredData()
      this.initializeNewChart()
      
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
    },
    setTheme() {
      this.$store.commit("changeColor", this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    },
    getFilteredData(){
      let filter = {}
      if (this.gridApi !== undefined || this.gridApi !== null) {
        // console.log( this.gridApi )
        let gridData = new jslinq(
          this.gridApi.clientSideRowModel.rowsToDisplay
        ).select(i => {
          return i.data;
        }).items;

        //convert date from grid display formatting to match what the server is sending
        filter.data = gridData.map(item => {
          let dtA = item.date.split(" ");
          let dateA = dtA[0].split("-");
          let dateString =
            dateA[2] +
            "-" +
            dateA[0] +
            "-" +
            dateA[1] +
            "T" +
            dtA[2] +
            ":" +
            dtA[3] +
            ":" +
            dtA[4] +
            ".000Z";
          return {
            date: dateString,
            id: item.id,
            project: item.project,
            raisedBy: item.raisedBy,
            severity: item.severity
          };
        });
      }
      return filter
    }
  },
  watch: {
    data(newData) {
      if (newData) {
        // this.updateChildren()
      }
    },
    color(newData) {
      if (newData) {
        console.log("c", newData)
        this.setTheme();
      }
    },
    lighting(newData) {
      if (newData) {
        console.log("l", newData)
        this.toggleDark(newData);
      }
    },
  }
};
</script>
<style>
.header {
  font-size: 1.2rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
}
.container {
  width: 100%;
  overflow: hidden;
}

.current-filter {
  padding: 0 0 0 20em;
  font-size: 0.6em;
}

.current-context {
  font-size: 0.8rem;
  margin: 0 0.6rem;
}

.grid {
  width: 100%;
  height: 85vh;
}

.select {
  padding: 0.3rem 0.6rem;
  font-family: inherit;
  font-size: 1.1rem;
  background: White;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(0, 0, 0, 0.3);
  color: black;
}

.header-button {
  padding: 0.3rem 0.6rem;
  font-family: inherit;
  font-size: 1.1rem;
  background: rgb(220, 220, 220) !important;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(0, 0, 0, 0.3);
}

.header-button:focus {
  outline: 0;
}

.header-button:disabled, .header-button[disabled]{
  opacity: .5
}

.ag-theme-dark {
  font-family: Roboto, sans-serif !important;
}

.theme--dark .ag-theme-material {
  background-color: #303030 !important;
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