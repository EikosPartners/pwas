<template>
  <div>
    <div v-if="usingGlue" class="container">
      <div class="header" :style="styleObject">
        <span>Shared Contexts</span>
      </div>
      <transition-group appear tag="ul" class="ul-comp col-rev" :name="`${color}in`" v-if="availableContexts.length > 0">
        <context-item  v-for="(ctx, i) in availableContexts" :key = "i" class="log-item" :contextName="ctx"></context-item>
      </transition-group>
      <ul class="ul-comp" v-else>
       <li class="li-comp" >No Shared Contexts</li>
     </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';
import contextItem from '@/components/CtxItem';

export default {
  name: 'Log',
  components: {
    contextItem: contextItem
  },
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  data() {
    return {
      gridInstance: false,
      usingGlue: true,
      currentContexts: [],
    };
  },
  computed: {
    ...mapState(['color', 'lighting']),
    ...mapGetters(['data']),
    availableContexts() {
      if (window.glue) {
        return window.glue.contexts.all()
      }
      else {
        return []
      }
    },
    styleObject() {
      if (this.lighting === 'dark') {
        return {
          backgroundColor: this.$store.getters.themeColors.vuetifyDark,
          color: '#fff'
        };
      } else {
        return {
          backgroundColor: this.$store.getters.themeColors.vuetifyLight,
          color: '#000'
        };
      }
    }
  },
  methods: {
    ...mapActions(['fetchColor', 'changeTheme', 'changeLighting']),
    ...mapMutations(['addData']),
    formatSource(sourceApp) {
      let withSpaces = sourceApp.replace(/([A-Z])/g, ' $1');
      return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    },
    parseDate(date) {
      let dateA = date.split('T')[0].split('-');
      let timeA = date.split('T')[1].split('.');
      let hms = timeA[0].split(':').join(' ');
      // return dateA[1] + "-" + dateA[2] + "-" + dateA[0] + " : " + hms;
      return timeA[0];
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
    }
  },
  sockets: {
    connect: function() {
      console.log('socket connected');
      this.$options.sockets.filterByDate = filter => {
        console.log('filter', filter);
        this.addData(filter);
      };
      this.$options.sockets.filterByProject = filter => {
        console.log('filter', filter);
        this.addData(filter);
      };
      this.$options.sockets.filterBySeverity = filter => {
        console.log('filter', filter);
        this.addData(filter);
      };
      this.$options.sockets.filterByRaisedBy = filter => {
        console.log('filter', filter);
        this.addData(filter);
      };
      this.$options.sockets.filterByDateAndSeverity = filter => {
        console.log('filter', filter);
        this.addData(filter);
      };
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
    }
  }
}
</script>

<style >
.header {
  font-size: 1.2rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
}

.log-item {
  border-bottom: 0.1rem dotted grey;
  padding-top: 0.5rem;
  font-size: 0.7rem;
  /* background-color: white; */
}

.ul-comp {
  display: flex;
  padding-top: 0;
  flex-direction: column;
}

.col-rev {
  flex-direction: column-reverse;
}

.ul-comp,
.li-comp {
  margin-left: 0;
  padding-left: 0 !important;
}

.li-comp {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  width: 100%;
}

.outer-span {
  display: flex;
  justify-content: flex-start;
  padding-left: 1rem;
  width: 25%;
}

.container {
  width: 90%;
  padding: 0 5%;
}

.blue-selected {
  background-color: #2da8c9;
}

.bluein-enter {
  background-color: rgba(45, 167, 201, 0.5);
}
.bluein-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(45, 167, 201, 0.5);
}
.bluein-enter-to {
  background-color: rgba(45, 167, 201, 0);
}

.pink-selected {
  background-color: #ba5288;
}

.pinkin-enter {
  background-color: rgba(184, 82, 136, 0.5);
}
.pinkin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(184, 82, 136, 0.5);
}
.pinkin-enter-to {
  background-color: rgba(184, 82, 136, 0);
}

.brown-selected {
  background-color: #e29755;
}

.brownin-enter {
  background-color: rgba(226, 151, 85, 0.5);
}
.brownin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(226, 151, 85, 0.5);
}
.brownin-enter-to {
  background-color: rgba(226, 151, 85, 0);
}

.green-selected {
  background-color: #53a976;
}

.greenin-enter {
  background-color: rgba(83, 169, 118, 0.5);
}
.greenin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(83, 169, 118, 0.5);
}
.greenin-enter-to {
  background-color: rgba(83, 169, 118, 0);
}

.red-selected {
  background-color: #c0392b;
}

.redin-enter {
  background-color: rgba(192, 57, 43, 0.5);
}
.redin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(192, 57, 43, 0.5);
}
.redin-enter-to {
  background-color: rgba(192, 57, 43, 0);
}

.grey-selected {
  background-color: #566573;
}

.greyin-enter {
  background-color: rgba(86, 101, 115, 0.5);
}
.greyin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(86, 101, 115, 0.5);
}
.greyin-enter-to {
  background-color: rgba(86, 101, 115, 0);
}

.yellow-selected {
  background-color: #ffff20;
}

.yellowin-enter {
  background-color: rgba(255, 255, 32, 0.5);
}
.yellowin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(255, 255, 32, 0.5);
}
.yellowin-enter-to {
  background-color: rgba(255, 255, 32, 0);
}

.theme--dark {
  color: white;
  background-color: #303030;
}

.theme--light {
  color: black;
  background-color: white;
}
</style>
