<template>
  <div class="container">
    <select v-if="!belongsToGrid" v-model="selected">
      <option disabled value="">Select context</option>
      <option v-for="(context, index) in availableContexts" :key="index">{{context}}</option>
    </select>
    <p v-if="!belongsToGrid">Subscribed to: {{selected}}</p>
    <heat-map
        v-if="themeColorsComp && themeColorsComp.length > 0"
        @jsc_click="filterByDate"
        :dataModel='heatData'
        title='Number of Tickets by Date'
        xaxis-label="date"
        yaxis-label="volume"
      ></heat-map>

  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { D3HeatMap, StyleTogglerMixin } from 'jscatalyst';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'HeatMap',
  components: {
    heatMap: D3HeatMap
  },
  mixins: [StyleTogglerMixin, Messaging, Windowing],
  data() {
    return {
      gridInstance: false,
      selected: ""
    };
  },
  computed: {
    ...mapGetters(['data']),
    ...mapState(['color','belongsToGrid']),
    availableContexts() {
      let availableContexts = []
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== "filteredGrid") {
          availableContexts.push( context)
        }
      })
      return availableContexts
    },
    heatData() {
      const heatData = [];
        let sorted = this.sortData(this.data);
        for (let date in sorted) {
          let dataObj = { date: date, volume: sorted[date] };
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
      console.log('socket connected');
      this.$options.sockets.refresh = () => {
        if (!this.belongsToGrid) {
          console.log('refresh!');
          this.updateData();
        }
      };
      /*
      this.$options.sockets.themeColor = data => {
        console.log(data);
        this.changeTheme(data.name);
      };
      */
    },
    themeColor: function(data) {
      debugger
        this.changeTheme(data.name.toLowerCase());
    }
  },
  methods: {
    ...mapActions(['updateData', 'changeTheme']),
    filterByDate(data) {
      let filter = {};
      filter.source = 'heatMap';
      filter.dataSource = '/';
      filter.data = this.parseDate(data.date);
      filter.time = new Date();
      // console.log(filter);

      this.filter(filter, 'filterOnGrid');

      // this.openContextWindow('Filter Results', 'http://localhost:9093', filter)

      // A Named object
      if (this.gridInstance === true) {
        debugger;
        // Can we pass the instance an updated context here?
      } else {
        let app = window.glue.appManager.application('JSCDataGrid');
        const localWindow = window.glue.windows.my();
        const localThis = this;
        let windowConfig = {
          relativeTo: localWindow.id,
          relativePosition: 'right'
        };
        // let windowConfig = { }

        // Launch the app and then wait for the return so that we can grab the instance Id
        app
          .start({ filter: filter, eventName: 'filterOnGrid' }, windowConfig)
          .then(instance => {
            //localThis.gridInstance = instance
          });

        this.gridInstance = true;
      }
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
      console.log('context update', context.data);
      this.output = context.data;
    });
  },
  watch: {
    color(newData) {
      if (newData) {
        this.setTheme();
      }
    },
    themeColorsComp(well) {
      // this.draw;
    },
    selected(newData) {
      if (newData) {
        this.subscribe(newData, (context, delta, removed) => {
          this.$store.commit('initializeData', context.filter.data)
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
  height: 90vh;
}
</style>
