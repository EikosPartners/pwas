<template>
<div class="container">
  <div :class="['header', `${color}-selected`]">
    <span>Grid</span>
     <span class="current-context">Id: {{contextId}}</span>
    <span class="current-filter">{{currentFilter}}</span>
    <button class="header-button" @click="removeFilter">Clear Filter</button>
    <select class="select" v-model="selected">
      <option disabled value="">Select chart</option>
      <option value="JSCBar">BarChart</option>
      <option value="JSCBubble">Bubble Chart</option>
      <option value="JSCHeatMap">Heat Map</option>
      <option value="JSCLine">Line Chart</option>
      <option value="JSCPie">Pie Chart</option>
    </select>
     <button class="header-button" @click="openNewChart">Open</button>
  </div>
    <ag-grid-vue
      id='Grid'
      class="grid ag-theme-material"
      :columnDefs='columns'
      :rowData='prettyData'
      :enableSorting='trueVar'
      :enableFilter='trueVar'
      :gridReady='onGridReady'
      :filterChanged='updateChildren'
      rowSelection='multiple'
    ></ag-grid-vue>
</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AgGridVue } from "ag-grid-vue";
import { StyleTogglerMixin } from 'jscatalyst';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
import jslinq from 'jslinq'

export default {
  name: "Grid",
  components: {
    AgGridVue
  }, 
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  computed: {
    ...mapState(["data", "columns", "currentFilter", "contextId", 'color', 'lighting']),
    prettyData() {
      return this.data.map(item => {
        let prettyItem = {};
        prettyItem.date = this.parseDate(item.date);
        prettyItem.project = item.project;
        prettyItem.raisedBy = item.raisedBy;
        prettyItem.severity = item.severity;
        prettyItem.id = item.id;
        return prettyItem;
      });
    }
  },
  data() {
    return {
      trueVar: true,
      selected: ""
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    filterByDate(filter) {
      console.log("filter", filter);
      this.removeFilter();
      this.setQuickFilter(filter.data);
      let source = this.formatSource(filter.source);
      this.setCurrentFilter(source);
    },
    filterByProject(filter) {
      console.log("filter", filter);
      this.removeFilter();
      this.setQuickFilter(filter.data);
      let source = this.formatSource(filter.source);
      this.setCurrentFilter(source);
    },
    filterBySeverity(filter) {
      console.log("filter", filter);
      this.removeFilter();
      this.setQuickFilter(filter.data);
      let source = this.formatSource(filter.source);
      this.setCurrentFilter(source);
    },
    filterByRaisedBy(filter) {
      console.log("filter", filter);
      this.removeFilter();
      this.setQuickFilter(filter.data);
      let source = this.formatSource(filter.source);
      this.setCurrentFilter(source);
    },
    filterByDateAndSeverity(filter) {
      console.log("filter", filter);
      this.removeFilter();
      let filterObject = {
        date: {
          type: "contains",
          filter: `${filter.data.date}`
        },
        severity: {
          type: "contains",
          filter: `${filter.data.severity}`
        }
      };
      this.gridApi.setFilterModel(filterObject);
      let source = this.formatSource(filter.source);
      this.setCurrentFilter(source);
    },
    filterByMonth(filter) {
      console.log("filter", filter);
      let month = filter.data.split("/")[0] + "-";
      let year = "-" + filter.data.split("/")[1];
      this.removeFilter();
      let filterObject = {
        date: {
          condition1: {
            type: "startsWith",
            filter: month
          },
          condition2: {
            type: "contains",
            filter: year
          },
          operator: "AND"
        }
      };
      this.gridApi.setFilterModel(filterObject);
      let source = this.formatSource(filter.source);
      this.setCurrentFilter(source);
    },
    themeLighting(data) {
      console.log(data);
      this.toggleDark();
    },
    themeColor(data) {
      console.log('fetchColor recieved', data);
      this.changeTheme(data.name);
    },
    refresh(data) {
      if (!window.glue.windows.my().context.filter) {
        console.log("refresh!");
        this.updateData();
        // this.updateChildren()
      }
    }  
  },
  methods: {
    ...mapMutations(["setCurrentFilter"]),
    ...mapActions(['updateData', 'fetchColor', 'changeTheme']),
    updateChildren() {
      if ( window.glue.windows.my().context === null ) {
        return
      }

      if ( window.glue.windows.my().context.eventName === 'filterOnGrid' ) {
        console.log('filteredGrid')
        return
      }

      let filter = {}
      let gridData = new jslinq(this.gridApi.clientSideRowModel.rowsToDisplay)
        .select ( i => { return i.data} ).items
      console.log('linq data', gridData.data)
      if (gridData) {
        //convert date from grid display formatting to match what the server is sending
        filter.data = gridData.map(item => {
          let dtA = item.date.split(" ")
          let dateA = dtA[0].split("-")
          let dateString = dateA[2] + "-" + dateA[0] + "-" + dateA[1] + "T" + dtA[2] + ":" + dtA[3] + ":" + dtA[4] + ".000Z"
          return {
            date: dateString,
            id: item.id,
            project: item.project,
            raisedBy: item.raisedBy,
            severity: item.severity
          }
        })
      } else {
        //if no filter has been applied to the grid use full data set from store
        filter.data = this.data
      }

      const uniqueName = 'filteredGrid' + this.contextId
      window.glue.contexts.set(uniqueName, {filter:filter, name:uniqueName})
      console.log('passed to children')
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      this.gridApi.sizeColumnsToFit();
      window.addEventListener("resize", () => {
        this.gridApi.sizeColumnsToFit();
      });
      const localWindow = window.glue.windows.my();
      const ctx = localWindow.context

      this.subscribe(ctx.eventName, (context, delta, removed) => {

      this.removeFilter();
      console.log('context', context)
      let source = this.formatSource(context.source);
      this.setCurrentFilter(source);
      if (context.source === "BubbleChart") {
        console.log("bubble chart", context);
         let filterObject = {
          date: {
            type: "contains",
            filter: `${context.data.date}`
          },
          severity: {
            type: "contains",
            filter: `${context.data.severity}`
          }
        };
        this.gridApi.setFilterModel(filterObject);

      }
      else if (context.source === "BarChart") {
        console.log("bar chart", context);
        let month = context.data.split("/")[0] + "-";
        let year = "-" + context.data.split("/")[1];

        let filterObject = { date: { condition1: { type: "startsWith", filter: month }, condition2: { type: "contains", filter: year }, operator: "AND" } };

        this.gridApi.setFilterModel(filterObject);
      } 
      else {
        this.setQuickFilter(context.data);
      }
    })
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
      const newChart = glue.appManager.application(this.selected)
      const localWindow = window.glue.windows.my();
      const ctx = localWindow.context

      // Get the data set from this component
      let filter = {
      }

      if ( this.gridApi !== undefined || this.gridApi !== null ) {
        // console.log( this.gridApi )
        let gridData = new jslinq(this.gridApi.clientSideRowModel.rowsToDisplay)
        .select ( i => { return i.data} ).items

        //convert date from grid display formatting to match what the server is sending
       filter.data = gridData.map(item => {
          let dtA = item.date.split(" ")
          let dateA = dtA[0].split("-")
          let dateString = dateA[2] + "-" + dateA[0] + "-" + dateA[1] + "T" + dtA[2] + ":" + dtA[3] + ":" + dtA[4] + ".000Z"
          return {
            date: dateString,
            id: item.id,
            project: item.project,
            raisedBy: item.raisedBy,
            severity: item.severity
          }
        })
      }
      const uniqueName = 'filteredGrid' + this.contextId
      console.log(uniqueName)

      window.glue.contexts.set(uniqueName, {filter:filter, name:uniqueName})
      let appContext = {
        localContext:ctx,
        contextName: uniqueName,
        filter:filter
        }
      
      newChart.start(
        appContext
        )
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
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  watch: {
    color(newData) {
      if (newData) {
        this.setTheme();
      }
    },
    lighting(newData) {
      if (newData) {
        if (newData === 'dark') {
          this.toggleDark();
        }
      }
    },
    data(newData) {
      if (newData) {
          this.updateChildren()
      }
    }
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
  font-size: 1.1rem;
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

.blue-selected {
  background-color: #2da8c9;
}

.pink-selected {
  background-color: #ba5288;
}

.brown-selected {
  background-color: #e29755;
}

.green-selected {
  background-color: #53a976;
}

.red-selected {
  background-color: #c0392b;
}

.grey-selected {
  background-color: #566573;
}

.yellow-selected {
  background-color: #ffff20;
}
</style>