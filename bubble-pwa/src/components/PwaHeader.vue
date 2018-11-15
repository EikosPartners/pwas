<template>
  <div :class="['header']" :style="styleObj">
      <span>{{title}}</span>
      <span class="current-context" v-if="availableContext">Subscribed:
        <span>{{availableContext}}</span>
      </span>
      <span v-else>Unsubscribed</span>
    </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import DragAndDrop from '@/mixins/DragAndDrop';

export default {
  name: "PwaHeader",
  props: ['title'],
  mixins: [StyleTogglerMixin, DragAndDrop],
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
    availableContext() {
      let availableContext  ;
      if (window.glue) {
        availableContext = window.glue.windows.my().contexts.contextName.split('filteredGrid')[1]       

      } else if (window.context) {
        availableContext = window.context
      }
      return availableContext;
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

