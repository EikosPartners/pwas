<template>
  <div v-if="usingGlue" class="container">
    <div class="header">Message Log</div>
    <transition-group appear tag="ul" name="bluein" v-if="data.length > 0">
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
    <div class="header">Message Log</div>
        <transition-group appear tag="ul" name="bluein" v-if="data.length > 0">
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
import { mapGetters, mapActions, mapMutations } from "vuex";
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: "Log",
  mixins: [Messaging, Windowing],
  data() {
    return {
      gridInstance: false,
      usingGlue: true
    };
  },
  mounted() {
    this.availableContexts.forEach((ctx) => {
      this.subscribe(ctx, (context, delta, removed) => {
        console.log('context update', context);
        this.addData(context)
      });
      console.log(ctx, "subscribed?")
    })
  },
  computed: {
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
    // ...mapActions(["fetchData"]),
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
    }
  }
};
</script>

<style >
.header {
  background: rgb(66, 184, 221);
  color: white;
  font-size: 1.5rem;
  padding: 1rem;
}

.log-item {
  border-bottom: 0.1rem dotted grey;
  padding-top: 0.5rem;
  font-size: 0.7rem;
  background-color: white;
}

.bluein-enter {
  background-color: rgba(66, 184, 221, 0.5);
}
.bluein-enter-active {
  transition: background-color 1.5s ease-in-out;
  background-color: rgba(66, 184, 221, 0.5);
}

.bluein-enter-to {
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
  padding-left: 0;
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
  width: 25%;
}

.container {
  width: 90%;
  padding: 0 5%;
  height: 90vh;
}
</style>
