<template>
  <div v-if="usingGlue" class="container">
    <div :class="['header', `${color}-selected`]">
      <span>Grid</span>
    </div>
    <transition-group appear tag="ul" :name="`${color}in`" v-if="data.length > 0">
      <li v-for="(ctx, i) in data" :key = "i" class="log-item">
        <span class="outer-span">
          <span>Source:</span>
          {{ctx.name}}
        </span>
        <span class="outer-span">
          <span>Filtered Change</span>
        </span>
      </li>
    </transition-group>
    <ul v-else>
      <li>Log Empty</li>
    </ul>
  </div>
  <div v-else class="container">
   <div :class="['header', `${color}-selected`]">
      <span>Grid</span>
    </div>
        <transition-group appear tag="ul" :name="`${color}in`" v-if="data.length > 0">
          <li v-for="(msg, i) in data" :key = "i" class="log-item">
            <span class="outer-span">
              <span>Sent:</span>
              {{parseDate(msg.time)}}
            </span>
            <span class="outer-span">
              <span>Source App:</span>
              {{formatSource(msg.source)}}
            </span>
            <span v-if="typeof msg.data === 'object' " class="outer-span">
              <span>Filtered By:</span>
              {{msg.data.date}} and {{msg.data.severity}}
            </span>
            <span v-else class="outer-span">
              <span>Filtered By:</span>
              {{msg.data}}
            </span>
            <span class="outer-span">
              <span>Data Source:</span>
              "{{msg.dataSource}}"
            </span>
          </li>
        </transition-group>
    <ul v-else>
      <li>Log Empty</li>
    </ul>
  </div>
</template>

<script>
import {  mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { StyleTogglerMixin } from 'jscatalyst';
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: "Log",
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  data() {
    return {
      gridInstance: false,
      usingGlue: true
    };
  },
  mounted() {
    this.availableContexts.forEach((ctx) => {
      this.subscribe(ctx, (context, delta, removed) => {
        this.addData(context)
      });
    })
  },
  computed: {
    ...mapState(['color', 'lighting']),
    ...mapGetters(["data"]),
     availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
      return availableContexts;
    }
  },
  methods: {
    ...mapActions(['fetchColor', 'changeTheme']),
    ...mapMutations(["addData"]),
    formatSource(sourceApp) {
      let withSpaces = sourceApp.replace(/([A-Z])/g, " $1");
      return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    },
    parseDate(date) {
      let dateA = date.split("T")[0].split("-");
      let timeA = date.split("T")[1].split(".");
      let hms = timeA[0].split(":").join(" ");
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
        if (newData === 'dark') {
          this.toggleDark();
        }
      }
    }
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$options.sockets.filterByDate = filter => {
        console.log("filter", filter);
        this.addData(filter);
      };
      this.$options.sockets.filterByProject = filter => {
        console.log("filter", filter);
        this.addData(filter);
      };
      this.$options.sockets.filterBySeverity = filter => {
        console.log("filter", filter);
        this.addData(filter);
      };
      this.$options.sockets.filterByRaisedBy = filter => {
        console.log("filter", filter);
        this.addData(filter);
      };
      this.$options.sockets.filterByDateAndSeverity = filter => {
        console.log("filter", filter);
        this.addData(filter);
      };
    },
    themeLighting(data) {
      console.log(data);
      this.toggleDark();
    },

    themeColor(data) {
      console.log('fetchColor recieved', data);
      this.changeTheme(data.name);
    }  
  }
};
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
  background-color: white;
}

ul {
  display: flex;
  flex-direction: column-reverse;
  padding-top: 0;
}

ul,
li {
  margin-left: 0;
  padding-left: 0 !important;
}

li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
}

span {
  padding: 0 2rem 0 0;
}

span span {
  font-weight: 700;
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
  height: 90vh;
}

.blue-selected {
  background-color: #2da8c9;
}

.bluein-enter {
  background-color:rgba(45,167,201, 0.5)
}
.bluein-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(45,167,201, 0.5)
}
.bluein-enter-to {
  background-color: white;
}

.pink-selected {
  background-color: #ba5288;
}

.pinkin-enter {
  background-color:rgba(184, 82, 136, 0.5)
}
.pinkin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(184, 82, 136, 0.5)
}
.pinkin-enter-to {
  background-color: white;
}

.brown-selected {
  background-color: #e29755;
}

.brownin-enter {
  background-color:rgba(226, 151, 85, 0.5)
}
.brownin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(226, 151, 85, 0.5)
}
.brownin-enter-to {
  background-color: white;
}

.green-selected {
  background-color: #53a976;
}

.greenin-enter {
  background-color:rgba(83, 169, 118, 0.5)
}
.greenin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(83, 169, 118, 0.5)
}
.greenin-enter-to {
  background-color: white;
}

.red-selected {
  background-color: #c0392b;
}

.redin-enter {
  background-color:rgba(192, 57, 43, 0.5)
}
.redin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(192, 57, 43, 0.5)
}
.redin-enter-to {
  background-color: white;
}

.grey-selected {
  background-color: #566573;
}

.greyin-enter {
  background-color:rgba(86, 101, 115, 0.5)
}
.greyin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(86, 101, 115, 0.5)
}
.greyin-enter-to {
  background-color: white;
}

.yellow-selected {
  background-color: #ffff20;
}

.yellowin-enter {
  background-color:rgba(255, 255, 32, 0.5)
}
.yellowin-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color:rgba(255, 255, 32, 0.5)
}
.yellowin-enter-to {
  background-color: white;
}

</style>
