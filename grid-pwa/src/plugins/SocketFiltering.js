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
                               localThis.initializeData(JSON.parse(data))
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
                }
            }
        })
    }
}

export default plugin