<template>
  <li class="context-li">
    <div class="context-header">
      <span v-if="clicked"  @click="toggleClicked">-</span>
      <span v-else  @click="toggleClicked">+</span>
      <span class="c-name">{{formattedContextName}}</span>
    </div>
    <div class="expanded" v-if="clicked">
      <filtered-on-detail v-if="contextName === 'filterOnGrid'" :contextName="contextName"></filtered-on-detail>
      <connect-themes-detail v-if="contextName === 'Connect.Themes'" :contextName="contextName"></connect-themes-detail>
      <global-theme-detail v-if="contextName === 'globalTheme'" :contextName="contextName"></global-theme-detail>
      <filtered-grid-detail v-if="contextName.includes('filteredGrid')" :contextName="contextName"></filtered-grid-detail>
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
import JSONtoHTML from '@/mixins/JSONtoHTML';

export default {
  name: 'ContextItem',
  mixins: [Messaging, Windowing, StyleTogglerMixin, JSONtoHTML],
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
    formattedContextName() {
      return this.formatText(this.contextName)
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
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.context-header {
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 1.1rem;
}

.key {
  font-weight: 700;
}

.c-name {
  font-weight: 700;
}

.expanded {
  width: 80vw;
  height: 50vh;
}

.data-container {
  display: flex;
  width: 100%;
  padding: 0.5rem;
}
</style>
