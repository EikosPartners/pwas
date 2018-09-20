<template>
  <div class="container">
    <div v-if="!belongsToGrid" class="header">
      <select class="select" v-model="selected">
        <option disabled value="">Select context</option>
        <option v-for="(context, index) in availableContexts" :key="index">{{context}}</option>
      </select>
      <p>Subscribed to: {{selected}}</p>
    </div>
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
      selected: ''
    };
  },
  computed: {
    ...mapGetters(['data']),
    ...mapState(['color', 'lighting', 'belongsToGrid']),
    availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
      return availableContexts;
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
    },
    themeColor: function(data) {
      this.changeTheme(data.name.toLowerCase());
    },
    themeLighting() {
      this.toggleDark();
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
    lighting(newData) {
      if (newData) {
        if (newData === 'dark') {
          this.toggleDark();
        }
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

.header {
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  /* min-height: 60px; */
}

.select {
  padding: 0.3rem 0.6rem;
  font-family: inherit;
  font-size: 1.1rem;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(0, 0, 0, 0.3);
}

p {
  font-size: 0.9rem;
}
</style>
