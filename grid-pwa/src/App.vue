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
    ...mapActions(["fetchData", "fetchColor"]),
    ...mapMutations(["setContextId"])
  },
  created() {
    this.fetchColor();
    this.fetchData();
    const IdNumber = Date.now()
    this.$store.commit('setContextId', `${IdNumber}`)
    const uniqueName = 'filteredGrid' + IdNumber
    window.glue.contexts.set(uniqueName, {})
  }
};
</script>

<style>

body {
  font-family: 'Roboto', sans-serif !important;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}

* {
  box-sizing: border-box;
}

:root {
  font-size: calc(0.3em + 1vw);
}

.theme--dark {
  color: white;
  background-color: grey;
}

.theme--light {
  color: black;
  background-color: white;
}

</style>
