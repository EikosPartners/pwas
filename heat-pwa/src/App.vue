<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Windowing from '@/mixins/Windowing';

export default {
  mixins: [Windowing],
  name: 'app',
  methods: {
    ...mapActions(['fetchData', 'fetchColor'])
  },
  created() {
    this.fetchData();
    this.fetchColor();

    this.enableOptions()
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
