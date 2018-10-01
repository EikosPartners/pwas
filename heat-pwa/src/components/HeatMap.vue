<template>
   <div class="container" @drop="handleDrop" @dragenter="handleDragEnter" @dragover="handleDragOver">
    <div :class="['header']" :style="styleObj">
      <span>Number of Tickets by Date</span>
      <span class="current-context">Subscribed:
        <select class="select" v-model="selected" v-on:click="populate">
          <option disabled value="">Select context</option>
          <option v-for="(context, index) in availableContexts" :key="index">{{context}}</option>
        </select>
      </span>
    </div>
    <heat-map
        v-if="themeColorsComp && themeColorsComp.length > 0"
        @jsc_click="filterByDate"
        :dataModel='heatData'
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
      availableContexts: [],
    };
  },
  computed: {
    ...mapGetters(['data', 'themeColors']),
    ...mapState(['color', 'lighting', 'belongsToGrid']),
    styleObj(){
      let background, text
      if (this.$store.state.themeMod.displayTheme === 'light') {
        background = this.themeColors.vuetifyLight
        text = '#000'
      } else {
        background = this.themeColors.vuetifyDark
        text = '#fff'
      }
      return {backgroundColor: background, color: text}
    },
    selected: {
      get() {
        return this.$store.state.selected
      },
      set(value) {
        this.$store.commit('setSelected', value)
      }
    },
    heatData() {
      const heatData = [];
      let sorted = this.sortData(this.data);
      for (let date in sorted) {
        let dataObj = { x: date, magnitude: sorted[date] };
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
      console.log("socket Connected!")
    },
    themeColor: function(data) {
      this.changeTheme(data.name.toLowerCase());
    },
    themeLighting() {
      this.toggleDark();
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
      debugger
      let local = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          local.push(context);
        }
      });
      this.availableContexts = local
    },
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
        // debugger;
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
    },
    handleDrop(event) {
     var ctxName = event.dataTransfer.getData('text/plain')
    console.log('drop', ctxName)
     this.$store.commit('setSelected', `filteredGrid${ctxName}`)
    event.preventDefault()
    },
    handleDragEnter(event) {
      event.dataTransfer.dropEffect = "copy"
      event.preventDefault()
      console.log("enter", event)
      return false
    },
    handleDragOver(event) {
      event.dataTransfer.dropEffect = "copy"
      event.preventDefault()
      console.log("over", event)
      return false
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
