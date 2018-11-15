<template>
  <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
    <pwa-header :title="compTitle" :availableContexts="availableContexts" />
    <bubble-chart 
      :isDate="true" 
      @jsc_click="handleFilter" 
      :dataModel="prettyData" 
      xAxisLabel="date" 
      yAxisLabel="severity"
    ></bubble-chart>
  </div>
</template>

<script>
import { D3BubbleChart, StyleTogglerMixin } from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';
import jslinq from 'jslinq';
import PwaHeader from '@/components/PwaHeader.vue'
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
import Filtering from '@/mixins/Filtering'
import DragAndDrop from '@/mixins/DragAndDrop'
import { log } from 'async';

export default {
  name: 'BubbleChart',
  components: {
    bubbleChart: D3BubbleChart,
    pwaHeader: PwaHeader
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing, DragAndDrop, Filtering],
  data() {
    return {
      compTitle: "Ticket Severity by Date",
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
    ...mapState(['color', 'lighting', 'belongsToGrid', 'selected']),
    availableContexts() {
      let availableContexts = [];
      if (window.glue) {
        window.glue.contexts.all().forEach(context => {
          if (context.includes('filteredGrid') && context !== 'filteredGrid') {
            availableContexts.push(context);
          }
        });

      } else if (window.context) {
        availableContexts.push(window.context)
      }
      return availableContexts;
    },
    prettyData() {
      let bubbleData = new jslinq(this.data)
        .select(item => {
          let date = item.date.split('T')[0];
          return {
            date,
            severity: item.severity
          };
        })
        .groupBy(i => {
          return i.date;
        })
        .groupBy(i => {
          let groupedSeverity = i.elements.groupBy(k => {
            return k.severity;
          });
          return groupedSeverity;
        })
        .orderByDescending(i => {
          return i.key;
        });
      let finalData = [];
      bubbleData.items.forEach(set => {
        set.key.forEach(k => {
          finalData.push({
            x: k[0].date,
            y: k.key,
            value: k.length,
            label: 'Date/severity'
          });
        });
      });
      return finalData;
    },
    
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
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData']),
    handleFilter(message) {

      // Preparation for JSC_Click update
      console.log(message)
      const data = message.data
      const clickEvent = message.event

      const filteredData = this.filterByDateAndSeverity(data)
      this.setContextFilterData(filteredData)
      if(this.handleShiftClick(clickEvent)){
        this.gridInstance = false
        this.manageContextWindow(this.contextFilter, "StandAloneGrid")
      }else{
        this.handleFilterOnGrid()
        this.filter(this.contextFilter, this.filterOnGridID);
        this.manageContextWindow(this.contextFilter, this.filterOnGridID)
      }
    },
    
    filterByDateAndSeverity(data){
      let date = this.parseDate(data.x).split("-")
      date = date[2] +"-"+date[0]+"-"+date[1]
      

      let filteredByDate = this.data.filter((i)=>{
        return i.date.split("T")[0] === date
      })

      let filteredData = filteredByDate.filter((i)=>{
        return i.severity === data.y
      })
      return filteredData
    },
    parseDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return month + '-' + day + '-' + year;
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
