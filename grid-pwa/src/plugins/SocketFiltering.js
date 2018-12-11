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
                initializeSocketContext(){
                    if (window.location.href.includes("?")) {
                        window.context = window.location.href.split('?')[1]
                        history.pushState(window.location.href, null, (window.location.href.split('?')[0]))
                      }              
                },
                initializeDataStream(){
                    if (window.context) {
                        this.$store.commit('setContextId', window.context)
                        let localThis = this
                             this.$socket.on(window.context + "dataToChild", function (data){
                               console.log('dataToChild received')
                               localThis.$store.dispatch('initializeData', JSON.parse(data))
                             })
                              this.$socket.on(window.context + "parentNameToChild", function(data){
                                console.log('parent name received')
                                localThis.$store.commit('setCurrentFilter', data)
                              })
                             this.$socket.emit("appManaged", window.context)
                             this.$socket.emit(window.context + "childReady", 'ready')
                      } else {
                
                        this.$store.dispatch('fetchData');
                      }
                },
                handleNewChartInfo(data){
                    console.log('chart info received')
                    let localThis = this
                    this.temporaryWindow.location.href = data.url + '?' + data.context
                    this.temporaryWindow = null
                    this.$store.commit('addChildContext', data.context)
                    this.$socket.on(data.context + "sendData", (event) => {
                      console.log('sendData received')
                      debugger //make sure localThis.temporaryData is in scope
                      localThis.$socket.emit(data.context + "dataToServer", JSON.stringify(localThis.temporaryData.data))
                    })              
                },
                handleUpdateChildren(){
                    this.temporaryData = this.getFilteredData()
                    let localThis = this
                    this.childContexts.forEach(context=>{
                        this.$socket.emit(context + "dataToServer", JSON.stringify(localThis.temporaryData.data))
                    })
                },
                handleGridReadyContext(){
                    console.log('handling')
                },
                initializeNewChart(){
                    this.temporaryWindow = window.open('', '_blank')
                    this.$socket.emit('appManager', {to: this.selected, from: 'JSCDataGrid'})            
                }
            }
        })
    }
}

export default plugin