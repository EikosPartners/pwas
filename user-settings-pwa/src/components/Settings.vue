<template>
  <div class="settings">
    <toolbar></toolbar>
    <theme-chooser @jsc_theme_change="themeHandler"/>
    <button @click="handleLighting">Lightbulb</button>
  </div>
</template>

<script>
import { ThemeChooserComponent, StyleTogglerMixin, Toolbar } from 'jscatalyst';
export default {
  name: 'Settings',
  mixins: [StyleTogglerMixin],
  components: {
    themeChooser: ThemeChooserComponent,
    toolbar: Toolbar
  },
  sockets: {
    connect() {
      console.log('Socket Connected');
    }
  },
  methods: {
    themeHandler(data) {
      this.$socket.emit('themeColor', data);
    },
    handleLighting(data) {
      console.log(data);
      this.toggleDark();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
