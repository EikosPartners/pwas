<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchData']),
    ...mapMutations(['initializeData', 'setBelongsToGrid'])
  },
  created() {
      const localWindow = window.glue.windows.my();
    const ctx = localWindow.context
    console.log("ctx filter", ctx.filter)
    if (ctx.filter) {
     console.log("filter.data", ctx.filter.data)
      this.$store.commit('initializeData', ctx.filter.data)
      //disables socket refresh
      this.$store.commit('setBelongsToGrid')
    }
    else {
      this.fetchData();
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
