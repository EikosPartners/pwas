<template>

   <div style="height: 400px">
     <p>Message Log:</p>
     <ul v-if="messages.length > 0">
       <li v-for="(msg, i) in messages" :key = "i"> {{msg}} </li>
     </ul>
     <ul v-else>
       <li>Log Empty</li>
     </ul>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Log",
  data() {
    return {
      messages: []
    };
  },
  methods: {
    ...mapActions(["fetchData"]),
    addData(msg) {
      this.messages.unshift(msg);
    }
  },
  created() {
    const data = this.fetchData();
    console.log("log", data);
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
    }
  }
};
</script>

<style>
</style>
