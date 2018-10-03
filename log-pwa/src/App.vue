<template>
  <div id="app" :class="computedClass">
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import Windowing from '@/mixins/Windowing';
import Messaging from '@/mixins/Messaging';

export default {
  mixins: [Windowing, Messaging],
  name: 'app',
  methods: {
    ...mapActions(['fetchColor']),
    ...mapMutations(['initializeData', 'setBelongsToGrid', 'setSelected', 'setColor', 'setLighting'])
  },
  created() {
    this.fetchColor();
     if (window.glue) {
      this.subscribe('globalTheme', (context, delta, removed) => {
        console.log("global theme context", context)
        this.setColor(context.color)
        this.setLighting(context.lighting)
      })
    }
  },
  computed: {
    ...mapState(['lighting']),
    computedClass() {
      console.log(this.lighting);
      return 'theme--' + this.lighting;
    }
  }
};
</script>


<style>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif !important;
}

:root {
  font-size: calc(0.3em + 1vw);
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
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
