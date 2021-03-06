<template>
    <heat-map
      v-if="themeColorsComp && themeColorsComp.length > 0"
      @jsc_click="handleFilter"
      :dataModel='heatData'
      xaxis-label="date"
      yaxis-label="volume"
    ></heat-map>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3HeatMap, StyleTogglerMixin } from '@/../node_modules/jscatalyst/dist/jscatalyst.js';
import ContextMixin from '@/mixins/ContextMixin';
import Windowing from '@/mixins/Windowing';
import Stream from '@/mixins/Stream'
import Notifications from '@/mixins/Notifications'
import { log } from 'async';

export default {
  name: 'HeatMap',
  components: {
    heatMap: D3HeatMap,
  },
  mixins: [StyleTogglerMixin, Windowing , Stream, Notifications ],
  data() {
    return {
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter', "stream"]),
    ...mapState(['color', 'lighting', 'belongsToGrid', 'selected']),
    heatData() {
      const heatData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { x: date, magnitude: sorted[date] };
        heatData.push(dataObj);
      }
      return heatData;
    },
    
    themeColorsComp() {
      return Object.values(this.$store.getters.themeColors);
    }
  },
  sockets: {
    connect: function() {
      console.log("socket Connected!")
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
    refresh() {
      if (!this.belongsToGrid) {
        console.log('refresh!');
        this.updateData();
      }
    },
    getNewChartInfo(data){
    // for children of Bubble
      console.log('chart info received')
      this.handleNewChartInfo(data)
    },

  },
  methods: {
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData', "setStream" ]),
    handleShiftClick(click){
          if (click.shiftKey){
              return true
          }
          return false
    },
    handleFilter(message) {
      /* Handle Filtering
       * @param {Object} message - Data recieved by clicking on a cell 
       *      data - cell date
       *      event - JS clickEvent
       */
      const data = message.data
      const clickEvent = message.event
      const filteredData = this.filterByDate(data)

      // Modify the filter in $store 
      this.setContextFilterData(filteredData)   

      // Object to be passed to filter mixin
      // const filterPkg = {
      //   clickEvent,
      //   filterObj: this.contextFilter,
      //   contextID: this.filterOnGridID
      // }

      // Execute Filter -- see filtering.js
      // const contextID = this.filter(filterPkg)
      // if(contextID !== undefined){
      //   this.setFilterOnGridID(contextID)
      // }
      if(this.handleShiftClick(clickEvent)){
        this.gridInstance = false
        this.handleStandAloneGrid(this.contextFilter)
      } else {
        this.handleFilterOnGrid()
        this.filter(this.contextFilter, this.filterOnGridID);
      }
      // this.testerMethod()
    },
  
    filterByDate(data){
       let filteredData = this.data.filter((i)=>{
        return i.date.split("T")[0] === data[0].x
      })
      return filteredData
    },
    parseDate(date) {
      const dateArray = date.split('-');
      return dateArray[1] + '-' + dateArray[2] + '-' + dateArray[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let justDate = item.date.split('T');
        let date = justDate[0];
        if (Object.keys(groupedData).includes(date)) {
          groupedData[date] += 1;
        } else {
          groupedData[date] = 1;
        }
      });
      return groupedData;
    },
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    },
    testerMethod(){
      // Testing Pub/Sub
      this.publishToStream()
      // Testing Notifications
      this.testNotification()
    },
    lifecycleTester(){
      // Testing onClose behavior
      window.addEventListener('beforeunload', function(e){
        debugger
        this.testNotification()
      })
      window.glue.windows.my().onClose((w)=>{
        debugger
        console.log(w)
      })
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
        this.toggleDark(newData);
      }
    },
    selected(newData) {
      if (newData) {
        this.subscribe(newData, (context, delta, removed) => {
          this.$store.commit('initializeData', context.filter.data);
        });
      }
    }
  }
};
</script>
<style>

.current-context {
  font-size: 1.1rem;
  margin: 0 0.6rem;
}

.select {
  padding: 0.3rem;
  font-family: inherit;
  font-size: 1.1rem;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(0, 0, 0, 0.3);
  background-color: white;
  color: black;
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
