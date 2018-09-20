<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "app",
  methods: {
    ...mapActions(["fetchData"]),
    ...mapMutations(["setContextId"])
  },
  created() {
    this.fetchData();
    const IdNumber = Date.now()
    this.$store.commit('setContextId', `${IdNumber}`)
    const uniqueName = 'filteredGrid' + IdNumber
    window.glue.contexts.set(uniqueName, {})
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

:root {
  font-size: calc(0.3em + 1vw);
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
