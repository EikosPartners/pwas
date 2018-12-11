import Vue from 'vue'

var plugin = {
    install(Vue, options) {
        
        Vue.mixin({
            data(){
                return {
                    gridInstance: false,
                }
            },
            methods: {
                initializeTheme(){
                    this.subscribe('globalTheme', (context, delta, removed) => {
                        console.log("global theme context", context)
                        this.setColor(context.color)
                        this.setLighting(context.lighting)
                      })
                },
                initializeGlueContext(){
                    console.log("in not undefined", window.glue)
                    if (window.glue.windows.my().context.eventName !== undefined){
                        let ctx = window.glue.windows.my().context
                        console.log("ctx",ctx)
                        this.initializeData(ctx.filter.data)
                    }
                    else{
                        this.fetchData();
                        const IdNumber = Date.now();
                        this.$store.commit('setContextId', `${IdNumber}`);
                        const uniqueName = 'filteredGrid' + IdNumber;
                        window.glue.contexts.set(uniqueName, {});
                    }
                }
            }

        })
    }
}

export default plugin