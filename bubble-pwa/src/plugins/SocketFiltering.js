import Vue from 'vue'

var plugin = {
    install(Vue, options) {
        
        Vue.mixin({
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
                }

            }
            
       })


    }
}

export default plugin