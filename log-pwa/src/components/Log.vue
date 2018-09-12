<template>
  <div class="container">
    <div class="header">Message Log</div>
    <ul v-if="data.length > 0">
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
          {{msg.data.date}} & {{msg.data.severity}}
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
    </ul>
    <ul v-else>
      <li>Log Empty</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "Log",
  computed: {
    ...mapGetters(["data"])
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
      return dateA[1] + "-" + dateA[2] + "-" + dateA[0] + " : " + hms;
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
  font-size: 1.5em;
  padding: 1rem;
}

.log-item {
  border-bottom: 0.1rem dotted grey;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
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
