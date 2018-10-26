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
import { log } from 'async';

export default {
  name: 'HeatMap',
  components: {
    heatMap: D3HeatMap,
    pwaHeader: PwaHeader
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing, DragAndDrop],
  data() {
    return {
      compTitle: "Number of Tickets by Date",
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
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
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData']),
    handleFilter(message) {
      // create an array of data, filtered by the appropriate criteria
      const data = message.data
      const clickEvent = message.event

      const filteredData = this.filterByDate(data)

      this.setContextFilterData(filteredData)   
      // set up a context for this instance of the HeatMap
      this.handleFilterOnGrid()
      this.filter(this.contextFilter, this.filterOnGridID);
      this.manageContextWindow()

      glue.agm.invoke(
            'T42.GNS.Publish.RaiseNotification', {
            notification: {
            title: 'Critical Alert',
            severity: 'High',
            description: 'Your machine is going to be restarted in 30 seconds'
          }
      })
      .then(() => console.log('Raised notification'))
      .catch(console.error);
      
      //The following subsrcibe code was for testing access to changes in the context
      // this.subscribe(this.filterOnGridID, (context, delta, removed) => {
      //   console.log('context update', context);
      //   console.log("context delta", delta)
      //   console.log("contxt removed", removed)
      //   this.output = context.data;
      // });
    },
    handleFilterOnGrid(){
      if(!!this.windowUnverified()){
          const uniqueID = Date.now()
          const contextID = 'filterOnGrid' + uniqueID
          this.setFilterOnGridID(contextID)
      }
    },
    windowUnverified(){
      if(this.filterOnGridID === null){
        return true
      }
      let context = this.filterOnGridID
      const windowsList = glue.windows.list()
      let window = windowsList.find(w=>{
        return w.context.eventName === context
      })
      if (!!window){
        
        return false
      }
      this.gridInstance = false
      return true
    },
    manageContextWindow(){

      if (this.gridInstance === true) {
        // Can we pass the instance an updated context here?
      } else {
        let app = window.glue.appManager.application('JSCDataGrid');
        const localWindow = window.glue.windows.my();
        const localThis = this;
        let windowConfig = {
          relativeTo: localWindow.id,
          relativePosition: 'right'
        };

        // Launch the app and then wait for the return so that we can grab the instance Id
        this.manageGridInstance()  // Added for testing purposes

        console.log(this.filterOnGridID)
        app
          .start({ filter: this.contextFilter, eventName: this.filterOnGridID }, windowConfig)
          .then(instance => {
            //localThis.gridInstance = instance
           
          });
        
        this.gridInstance = true;
      }
    },
  
    manageGridInstance(){
      glue.appManager.onAppRemoved((appication)=>{
        console.log(appication)
      })
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
    }
  },
  created() {
    this.subscribe('filterOnGrid', (context, delta, removed) => {
      console.log('context update', context);
      this.output = context.data;
    });
   
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
