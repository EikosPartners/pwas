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
    ...mapMutations(['initializeData', 'setBelongsToGrid', 'setSelected'])
  },
  created() {
    this.fetchColor();
    const localWindow = window.glue.windows.my();
    const ctx = localWindow.context;
    const contextName = ctx.contextName;

    if (contextName) {
      this.$store.commit('setBelongsToGrid'); //disables socket refresh
      this.$store.commit('setSelected', contextName)
  }

    this.subscribe(contextName, (context, delta, removed) => {
      debugger;
      this.$store.commit('initializeData', context.filter.data);
    });

    if (ctx.filter) {
      this.$store.commit('initializeData', ctx.filter.data);
    } else {
      this.fetchData();
    }
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
