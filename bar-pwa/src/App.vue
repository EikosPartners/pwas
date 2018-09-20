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
    this.fetchColor();

    const localWindow = window.glue.windows.my();
    const ctx = localWindow.context;
    const contextName = ctx.contextName;

    if (contextName) {
      this.$store.commit('setBelongsToGrid'); //disables socket refresh
    }

    this.subscribe(contextName, (context, delta, removed) => {
      this.$store.commit('initializeData', context.filter.data);
    });

    if (ctx.filter) {
      this.$store.commit('initializeData', ctx.filter.data);
      localWindow.onContextUpdated((context, win) =>
        console.log('update context:', context)
      );
    } else {
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
