<template>
   <div :class="['header']" :style="styleObj">
      <span>{{title}}</span>
      <span class="current-context" v-if="inGlue && selected !== ''">Subscribed:
        <span>{{selected.split('d')[2]}}</span>
      </span>
      <span v-else-if="inGlue && selected == ''">Unsubscribed</span>
        <span class="current-context" v-else>Subscribed:
        <select class="select" v-model="selected" v-on:click="populate">
          <option disabled value="">Select context</option>
          <option v-for="(context, index) in this.availableContexts" :value="context" :key="index">{{context}}</option>
        </select>
      </span>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import DragAndDrop from '@/mixins/DragAndDrop';

export default {
  name: "PwaHeader",
  mixins: [StyleTogglerMixin, DragAndDrop],
  data(){
    return{
      title: "Ticket Severity by Date",
    }
  },
  computed: {
    ...mapGetters(['themeColors']),
    ...mapState(['color', 'lighting']),
    styleObj(){
      let background, text
      if (this.$store.state.themeMod.displayTheme === 'light') {
        background = this.themeColors.vuetifyLight
        text = '#000'
      } else {
        background = this.themeColors.vuetifyDark
        text = '#fff'
      }
      return {backgroundColor: background, color: text}
    },
    availableContexts() {
      let availableContexts = [];
      window.glue.contexts.all().forEach(context => {
        if (context.includes('filteredGrid') && context !== 'filteredGrid') {
          availableContexts.push(context);
        }
      });
      return availableContexts;
    },
    selected: {
      get() {
        return this.$store.state.selected
      },
      set(value) {
        this.$store.commit('setSelected', value)
      }
    }
  },
  methods: {
    ...mapActions(['changeTheme']),
    setTheme() {
      this.$store.commit('changeColor', this.color);
      if (this.$store.state.themeMod) {
        this.chooseTheme(this.$store.state.themeMod.colorTheme);
      }
    },
    createOrPopulate(){
      if (window.glue) {
        this.populate()
      } else {
        debugger
      }
    }
  },
  watch: {
    selected(newData) {
      if (newData) {
        this.subscribe(newData, (context, delta, removed) => {
          this.$store.commit('initializeData', context.filter.data);
        });
      }
    }
  }
}
</script>

<style>
  
.header {
  font-size: 1.2rem;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 10vh;
  /* min-height: 60px; */
}
</style>
