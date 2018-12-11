<template>
  <div id="app" :class="computedClass">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import Windowing from "@/mixins/Windowing"

export default {
  name: 'app',
  methods: {
    ...mapActions(['fetchColor']),
  },
  mixins: [StyleTogglerMixin, Windowing],
  created() {
    this.fetchColor();
  },
  computed: {
    ...mapState(['lighting']),
    computedClass() {
      return 'theme--' + this.lighting;
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
  background-color: #303030;
}

.theme--light {
  color: black;
  background-color: white;
}
</style>
