import Vue from 'vue'

var plugin = {
    install(Vue, options) {
        
        Vue.mixin({
            data(){
                return {
                    gridInstance: false,
                    temporaryWindow: null
                }
            },
            methods: {
                // from App.vue
                initializeSocketContext() {
                    if (window.location.href.includes("?")) {
                        window.context = window.location.href.split('?')[1]
                        history.pushState(window.location.href, null, (window.location.href.split('?')[0]))
                      }
                },
                // from App.vue
                initializeDataStream(){
                    if (window.context) {
                        let localThis = this
                        this.$socket.on(window.context + "dataToChild", function (data){
                          console.log('dataToChild received')
                          localThis.$store.commit('initializeData', JSON.parse(data))
                        })
                        this.$socket.emit("appManaged", window.context)
                        this.$socket.emit(window.context + "childReady", 'ready')
                        this.$store.commit('setBelongsToGrid')
              
                      } else {
                        this.$store.dispatch('fetchData');
                      }
                },
                // from BubbleChart.vue
                handleNewChartInfo(data){
                    let localThis = this
                    this.temporaryWindow.location.href = data.url + '?' + data.context
                    this.temporaryWindow = null
                    if (!data.shift) {
                      this.setFilterOnGridID(data.context)
                    }
                    this.$socket.on(data.context + "sendData", (event) => {
                      console.log('sendData received')
                      localThis.$socket.emit(data.context + 'parentNameToServer', data.filter)
                      localThis.$socket.emit(data.context + "dataToServer", JSON.stringify(localThis.contextFilter.data))
                    })
                },
                // from Filtering mixin 
                handleStandAloneGrid(contextFilter = null){
                    // opens a new grid / context for a standalone (shift clicked) instance  
                    this.temporaryWindow = window.open('', '_blank')
                    this.$socket.emit('appManager', {to: 'JSCDataGrid', from: 'JSCLine', shift: true}) 
                },
                handleFilterOnGrid(data){
                    if (!this.$store.state.filterOnGridID) {
                        // if no child grid / context opened yet, open one
                        this.temporaryWindow = window.open('', '_blank')
                        this.$socket.emit('appManager', {to: 'JSCDataGrid', from: 'JSCLine'}) 
                        this.gridInstance = true
                      }
                },
                manageContextWindow(contextFilter, filterOnGridId){
                    this.$socket.emit(filterOnGridId + 'dataToServer', JSON.stringify(contextFilter.data))
                },
                // from Messaging mixin
                filter: function(filter, name) {
                      console.log('WEBSockets: Filtering message ' + filter);
                },
            }            
       })


    }
}

export default plugin