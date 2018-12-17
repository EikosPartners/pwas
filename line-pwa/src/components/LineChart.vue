<template>
  <line-chart 
    @jsc_click="handleFilter" 
    :dataModel="lineData"
  />
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3LineChart, StyleTogglerMixin } from 'jscatalyst';
import PwaHeader from '@/components/PwaHeader.vue'
import Windowing from '@/mixins/Windowing';
import Filtering from '@/mixins/Filtering';
import DragAndDrop from '@/mixins/DragAndDrop'

export default {
  name: 'LineChart',
  components: {
    lineChart: D3LineChart,
    pwaHeader: PwaHeader
  },
  mixins: [StyleTogglerMixin, Windowing, DragAndDrop],
  data() {
    return {
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
    ...mapState(['color', 'belongsToGrid', 'lighting', 'selected']),
    
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
      const data = message.data
      const clickEvent = message.event
      const filteredData = this.filterByDate(data)
      this.setContextFilterData(filteredData)

      const filterPkg = {
        clickEvent,
        filterObj: this.contextFilter,
        contextID: this.filterOnGridID
      }
      debugger
      const contextID = this.filter(filterPkg)
        if(contextID !== undefined){
          this.setFilterOnGridID(contextID)
        }
      
      // if(this.handleShiftClick(clickEvent)){
      //   this.gridInstance = false
      //   this.manageContextWindow(this.contextFilter, "StandAloneGrid")
      // }else{
      //   this.handleFilterOnGrid()
      //   this.filter(this.contextFilter, this.filterOnGridID);
      //   this.manageContextWindow(this.contextFilter, this.filterOnGridID)
      // }
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

