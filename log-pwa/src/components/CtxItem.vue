<template>
  <li class="context-li">
    <button @click="toggleClicked">X</button>
    <span>{{contextName}}</span>
    <div v-if="clicked">
      <filtered-on-detail v-if="contextName === 'filterOnGrid'" :contextName="contextName"></filtered-on-detail>
      <connect-themes-detail v-if="contextName === 'Connect.Themes'" :contextName="contextName"></connect-themes-detail>
      <global-theme-detail v-if="contextName === 'globalTheme'" :contextName="contextName"></global-theme-detail>
      <filtered-grid-detail v-else :contextName="contextName"></filtered-grid-detail>
    </div>
  </li>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StyleTogglerMixin } from 'jscatalyst';
import filteredGridDetail from '@/components/FilteredGridDetail.vue'
import filteredOnDetail from '@/components/FilteredOnDetail.vue'
import connectThemesDetail from '@/components/ConnectThemesDetail.vue'
import globalThemeDetail from '@/components/GlobalThemeDetail.vue'
import Messaging from '@/mixins/Messaging';
import Windowing from '@/mixins/Windowing';

export default {
  name: 'ContextItem',
  mixins: [Messaging, Windowing, StyleTogglerMixin],
  props: ['contextName'],
  components: {
    filteredGridDetail,
    filteredOnDetail,
    connectThemesDetail,
    globalThemeDetail
  },
  data() {
    return {
      clicked: false
    }
  },
  computed: {
    parseContext() {
      return this.jsonToHTML(this.context)
      },
    test() {
      return JSON.stringify(this.context)
    }
  },
  methods: {
    toggleClicked() {
      this.clicked = !this.clicked
    }
  }
}
</script>
<style>

.context-li {
  display:flex;
  align-items: flex-start;
  justify-content: space-between;
}
</style>
