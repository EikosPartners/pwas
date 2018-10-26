<template>
  <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
    <pwa-header :title="compTitle" :availableContexts="availableContexts" />
    <line-chart 
      @jsc_click="handleFilter" 
      :dataModel="lineData"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3LineChart, StyleTogglerMixin } from 'jscatalyst';
import PwaHeader from '@/components/PwaHeader.vue'
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
import DragAndDrop from '@/mixins/DragAndDrop'

export default {
  name: 'LineChart',
  components: {
    lineChart: D3LineChart,
    pwaHeader: PwaHeader
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing, DragAndDrop],
  data() {
    return {
      compTitle: "Ticket Severity by Date",
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
    ...mapState(['color', 'belongsToGrid', 'lighting', 'selected']),
    availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
      return availableContexts;
    },
    lineData(){
      const modifiedData = [];
      this.data.forEach(datum => {
        const temp = {
          date: datum.date.split('T')[0],
          value: datum.severity
        };
        modifiedData.push(temp);
      });
      return modifiedData;
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
    ...mapActions(['changeTheme', 'updateData', 'setFilterOnGridID', 'setContextFilterData']),
    handleFilter(message) {

      console.log(message)
      const data = message

      const filteredData = this.filterByDate(data)
      this.setContextFilterData(filteredData)
      this.handleFilterOnGrid()
      this.filter(this.contextFilter, this.filterOnGridID);
      this.manageContextWindow()
    },
    handleFilterOnGrid(){
      
      if (!!this.windowUnverified()){
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
        console.log(this.filterOnGridID)
        app
          .start({ filter: this.contextFilter, eventName: this.filterOnGridID }, windowConfig)
          .then(instance => {
            //localThis.gridInstance = instance
           
          });
        
        this.gridInstance = true;
      }
    },
    filterByDate(data){

      let date = this.formatDate(data.date).split("-")
      date = date[2] +"-"+date[0]+"-"+date[1]
      
      let filteredData = this.data.filter((i)=>{
        return i.date.split("T")[0] === date
      })
      return filteredData

    },
    formatDate(dateObj) {
      let date = new Date(dateObj);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      return `${month}-${day}-${year}`;
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
 
<style >
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

