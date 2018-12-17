<template>
    <pie-chart 
    :dataModel="prettyData"  
    @jsc_click="handleFilter" 
    />
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3PieChart, StyleTogglerMixin } from 'jscatalyst';
import jslinq from 'jslinq';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'PieChart',
  components: {
    pieChart: D3PieChart,
  },
  mixins: [StyleTogglerMixin, Windowing],
  data() {
    return {
      gridInstance: false,
      gluAvailable: window.glue
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors', 'filterOnGridID', 'contextFilter']),
    ...mapState(['color', 'lighting', 'belongsToGrid', 'selected']),
   
    prettyData() {
      const pieLinqData = new jslinq(this.data)
        .select(d => {
          return {
            label: d.project,
            value: d.severity
          };
        })
        .groupBy(d => {
          return d.label;
        });
      let temp = pieLinqData.items.map(i => {
        return i;
      });
      const finalData = [];
      temp.forEach(i => {
        finalData.push({
          label: i.key,
          value: i.count
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
    }
  },
  methods: {
    ...mapActions(['updateData', 'changeTheme', 'setFilterOnGridID', 'setContextFilterData']),
    handleFilter(message) {

      console.log(message)
      const data = message.data
      const clickEvent = message.event
      const filteredData = this.filterByProject(data)

      this.setContextFilterData(filteredData)

       const filterPkg = {
        clickEvent,
        filterObj: this.contextFilter,
        contextID: this.filterOnGridID
      }

      const contextID = this.filter(filterPkg)
      if(contextID !== undefined){
        this.setFilterOnGridID(contextID)
      }
    },
    
    filterByProject(data){
        
      let filteredData = this.data.filter((i) =>{
        return i.project === data.data.label
      })
      return filteredData
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
