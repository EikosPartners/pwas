<template>
  <div class="settings">
    <toolbar title="User Settings" :logoLight="lightLogo" :logoDark="darkLogo" @jsc_theme_change="themeHandler" @jsc_ld_change="lightingHandler"/>
  </div>
</template>

<script>
import { ThemeChooserComponent, StyleTogglerMixin, Toolbar } from 'jscatalyst';
import { mapState } from 'vuex';
import logoLight from '../../static/ep-logo-yellow.png';
import logoDark from '../../static/ep-logo-black.png';

export default {
  name: 'Settings',
  mixins: [StyleTogglerMixin],
  components: {
    themeChooser: ThemeChooserComponent,
    toolbar: Toolbar
  },
  data() {
    return {
      lightLogo: logoLight,
      darkLogo: logoDark
    };
  },
  computed: {
    ...mapState(['color', 'lighting'])
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
    lightingHandler(data) {
      this.$socket.emit('themeLighting', data);
    },
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    }
  },
  watch: {
    color(newData) {
      if (newData) {
        this.setTheme();
      }
    },
    lighting(newData) {
      if (newData) {
        if (newData === 'dark') {
          this.toggleDark();
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
