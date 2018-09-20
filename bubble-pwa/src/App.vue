<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import Windowing from '@/mixins/Windowing';
import Messaging from '@/mixins/Messaging';

export default {
  mixins: [Windowing, Messaging],
  name: 'app',
  methods: {
    ...mapActions(['fetchData']),
    ...mapMutations(['initializeData', 'setBelongsToGrid'])
  },
  created() {
    const localWindow = window.glue.windows.my();
    const ctx = localWindow.context
    const contextName = ctx.contextName

    if (contextName) {
      this.$store.commit('setBelongsToGrid') //disables socket refresh
    }

    this.subscribe(contextName, (context, delta, removed) => {
      debugger
      this.$store.commit('initializeData', context.filter.data)
    });

    if (ctx.filter) {
      this.$store.commit('initializeData', ctx.filter.data)
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
