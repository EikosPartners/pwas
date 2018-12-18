<template>
    <bar-chart
      @jsc_click="handleFilter"
      :dataModel='barDataProject'
      xaxisLabel="Date"
      yaxisLabel="Number of Tickets"
      :xAxisAngle='45'
    ></bar-chart>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3BarChart, StyleTogglerMixin } from 'jscatalyst';
import jslinq from 'jslinq';
import Windowing from '@/mixins/Windowing';
import Filtering from '@/mixins/Filtering';

export default {
  name: 'BarChart',
  components: {
    barChart: D3BarChart,
  },
  mixins: [StyleTogglerMixin, Windowing ],
  data() {
    return {
      gridInstance: false
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
    ...mapState(['color', 'belongsToGrid', 'lighting', 'selected']),
    
    prettyData() {
      let barData = [];
      let sorted = this.sortData(this.data);
      for (let year in sorted) {
        let oneYearData = [];
        for (let month in sorted[year]) {
          let date = month + '/' + year;
          let dataObj = { x: date, y: sorted[year][month] };

          oneYearData.push(dataObj);
        }
        oneYearData.sort((a, b) => {
          let val1 = parseInt(a.x.split('/')[0]);
          let val2 = parseInt(b.x.split('/')[0]);

          return val1 - val2;
        });

        barData = barData.concat(oneYearData); //why no work???
      }

      return barData;
    },
    barDataProject() {
      let barLinqData = new jslinq(this.data)
        .select(d => {
          return {
            x: d.project,
            severity: d.severity
          };
        })
        .groupBy(d => {
          return d.x;
        });
      let temp = barLinqData.items.map(i => {
        return i;
      });
      const finalData = [];
      temp.forEach(i => {
        finalData.push({
          x: i.key,
          y: i.count
        });
      });
      return finalData;
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
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData']),
    handleShiftClick(click){
        console.log(click.shiftKey)
        if (click.shiftKey){
            return true
        }
        return false
    },
    handleFilter(message) {
      console.log(message)
      const data = message.data // Prep for JSC_click update
      const clickEvent = message.event
      const filteredData = this.filterByProject(data)
      this.setContextFilterData(filteredData)

      const filterPkg = {
        clickEvent,
        filterObj: this.contextFilter,
        contextID: this.filterOnGridID
      }
      // console.log(filterPkg)
      // const contextID = 
      this.filter(filterPkg)
      // if(contextID !== undefined){
      //   this.setFilterOnGridID(contextID)
      // }

      // if(this.handleShiftClick(clickEvent)){
      //   this.gridInstance= false
      //   this.manageContextWindow(this.contextFilter, "StandAlongGrid")
      // }
      // else{
      //   this.handleFilterOnGrid()
      //   this.filter(this.contextFilter, this.filterOnGridID);
      //   this.manageContextWindow(this.contextFilter , this.filterOnGridID)
      // }
    
    },
    filterByProject(data){
      let filteredData = this.data.filter((i)=>{
        return i.project === data.x
      })
      return filteredData
    },
    parseDate(date) {
      let dateA = date.split('T')[0].split('-');
      return dateA[1] + '-' + dateA[2] + '-' + dateA[0];
    },
    sortData(rawData) {
      const groupedData = {};
      rawData.forEach(item => {
        let date = this.parseDate(item.date);
        let year = this.parseYear(date);
        let month = this.parseMonth(date);
        if (Object.keys(groupedData).includes(year)) {
          if (groupedData[year][month]) {
            groupedData[year][month] += 1;
          } else {
            groupedData[year][month] = 1;
          }
        } else {
          groupedData[year] = {};
        }
      });
      return groupedData;
    },
    parseYear(date) {
      let year = date.split('-')[2];
      return year;
    },
    parseMonth(date) {
      let month = date.split('-')[0];
      return month;
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
