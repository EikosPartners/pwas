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
    ...mapActions(['fetchData', 'fetchColor']),
    ...mapMutations(['initializeData', 'setBelongsToGrid'])
  },
  created() {
    const localWindow = window.glue.windows.my();
    const ctx = localWindow.context
    const contextName = ctx.contextName

     this.subscribe(contextName, (context, delta, removed) => {
      debugger
      this.$store.commit('initializeData', context.filter.data)
    });

    if (ctx.filter) {
      this.$store.commit('initializeData', ctx.filter.data)
      this.$store.commit('setBelongsToGrid') //disables socket refresh
      localWindow.onContextUpdated((context, win) => console.log('update context:', context))
    }
    else {
      this.fetchData();
    }
    this.fetchColor();

    this.enableOptions();
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
</style>
