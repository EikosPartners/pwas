<template>
  <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
    <pwa-header :title="compTitle" :availableContexts="availableContexts" />
    <heat-map
      v-if="themeColorsComp && themeColorsComp.length > 0"
      @jsc_click="handleFilter"
      :dataModel='heatData'
      xaxis-label="date"
      yaxis-label="volume"
    ></heat-map>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3HeatMap, StyleTogglerMixin } from '@/../node_modules/jscatalyst/dist/jscatalyst.js';
import PwaHeader from '@/components/PwaHeader.vue'
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
import DragAndDrop from '@/mixins/DragAndDrop';
import Filtering from '@/mixins/Filtering'
import Stream from '@/mixins/Stream'
import Notifications from '@/mixins/Notifications'
import { log } from 'async';

export default {
  name: 'HeatMap',
  components: {
    heatMap: D3HeatMap,
    pwaHeader: PwaHeader
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing, DragAndDrop, Filtering, Stream, Notifications ],
  data() {
    return {
      compTitle: "Number of Tickets by Date",
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
    availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
     
      return availableContexts;
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
    }
  },
  methods: {
    populate() {
      let local = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          local.push(context);
        }
      });
      this.availableContexts = local
    },
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData', "setStream" ]),
    handleFilter(message) {
      // create an array of data, filtered by the appropriate criteria
      const data = message.data
      const clickEvent = message.event
      const filteredData = this.filterByDate(data)
      this.setContextFilterData(filteredData)   

      if(this.handleShiftClick(clickEvent)){
      // Case: Shift Click
      this.gridInstance = false
      this.manageContextWindow(this.contextFilter, "StandAloneGrid")
      }else{
      // Case: Default Click (no 'Shift')
      this.handleFilterOnGrid()
      this.filter(this.contextFilter, this.filterOnGridID);
      this.manageContextWindow(this.contextFilter, this.filterOnGridID)
      }

      this.testNotification()
      this.publishToStream()
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
    
  },
  created() {
    this.subscribe('filterOnGrid', (context, delta, removed) => {
      console.log('context update', context);
      this.output = context.data;
    });
    this.createStream()
    this.subscribeToStream()

   
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
.container {
  width: 90%;
  padding: 0 5%;
  height: 80vh;
}

.current-context {
  font-size: 1.1rem;
  margin: 0 0.6rem;
}

.header {
  font-size: 1.2rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  /* min-height: 60px; */
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
