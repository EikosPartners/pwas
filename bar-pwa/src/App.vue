<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapMutations  } from 'vuex';
import Windowing from '@/mixins/Windowing';


export default {
  mixins: [Windowing],
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor']),
    ...mapMutations(['initializeData', 'setBelongsTo'])
  },
  created() {
    const localWindow = window.glue.windows.my();
    const ctx = localWindow.context
    console.log("ctx filter", ctx.filter)
    if (ctx.filter) {
     console.log("filter.data", ctx.filter.data)
      this.$store.commit('initializeData', ctx.filter.data)
      //disables socket refresh
      this.$store.commit('setBelongsTo')
    }
    else {
      this.fetchData();
    }
    this.fetchColor();
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
