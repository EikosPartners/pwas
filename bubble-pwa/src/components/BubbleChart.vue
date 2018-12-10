<template>
    <bubble-chart 
      :isDate="true" 
      @jsc_click="handleFilter" 
      :dataModel="prettyData" 
      xAxisLabel="date" 
      yAxisLabel="severity"
    ></bubble-chart>
</template>

<script>
import { D3BubbleChart, StyleTogglerMixin } from 'jscatalyst';
import { mapGetters, mapState, mapActions } from 'vuex';
import jslinq from 'jslinq';
// import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
// import Filtering from '@/mixins/Filtering'
import { log } from 'async';

export default {
  name: 'BubbleChart',
  components: {
    bubbleChart: D3BubbleChart,
  },
  mixins: [StyleTogglerMixin, Windowing],
  data() {
    return {
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
    ...mapState(['color', 'lighting', 'belongsToGrid', 'selected']),
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
    },
    getNewChartInfo(data){
      // for children of Bubble
        console.log('chart info received')
        let localThis = this
        this.temporaryWindow.location.href = data.url + '?' + data.context
        this.temporaryWindow = null
        if (!data.shift) {
          this.setFilterOnGridID(data.context)
        }
        this.$socket.on(data.context + "sendData", (event) => {
          console.log('sendData received')
          localThis.$socket.emit(data.context + 'parentNameToServer', data.filter)
          localThis.$socket.emit(data.context + "dataToServer", JSON.stringify(localThis.contextFilter.data))
        })
      },
  },
  methods: {
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData']),
    handleShiftClick(click){
          if (click.shiftKey){
              return true
          }
          return false
    },
    handleFilter(message) {
      console.log(message)
      const data = message.data
      const clickEvent = message.event

      const filteredData = this.filterByDateAndSeverity(data)
      this.setContextFilterData(filteredData)
      
      if(this.handleShiftClick(clickEvent)){
        this.gridInstance = false
        this.handleStandAloneGrid(this.contextFilter)
      } else {
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
