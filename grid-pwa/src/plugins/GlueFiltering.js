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
                        this.$store.dispatch('initializeData', ctx.filter.data)
                    }
                    else{
                        this.$store.dispatch('fetchData');
                        const IdNumber = Date.now();
                        this.$store.commit('setContextId', `${IdNumber}`);
                        const uniqueName = 'filteredGrid' + IdNumber;
                        window.glue.contexts.set(uniqueName, {});
                    }
                },
                subscribe: function(name, subscriber) {
                    if ( name === undefined ) return
                    window.glue.contexts.subscribe(name, (context, delta, removed) => {
                        if ( subscriber !== undefined ) {
                            subscriber(context, delta, removed)
                        }
                    })
                },
                filter(filter){
                    alert('GLUE42: Filtering message ' + filter);
                    window.glue.contexts.update('filter', filter);
                },
                handleUpdateChildren(){
                    if (window.glue.windows.my().context === null) {
                        return;
                    }
            
                    if (window.glue.windows.my().context.eventName === "filterOnGrid") {
                        console.log("filteredGrid");
                        return;
                    }
            
                    let filter = this.getFilteredData()
            
                    const uniqueName = "filteredGrid" + this.contextId;
                    window.glue.contexts.set(uniqueName, {
                        filter: filter,
                        name: uniqueName
                    });
                },
                handleGridReadyContext(){
                    const localWindow = window.glue.windows.my();
                    const ctx = localWindow.context;
                    console.log("onGridReady",ctx)
                    if (ctx.eventName !== undefined) {
                        this.subscribe(ctx.eventName, (context, delta, removed) => {
                        this.removeFilter();
                        console.log("subscribe context", context);
                        let source = this.formatSource(context.source);
                        this.setCurrentFilter(source);
                        this.$store.dispatch('initializeData', context.data)    
                    });
                }
            },
            initializeNewChart(){
                const newChart = glue.appManager.application(this.selected);
                const localWindow = window.glue.windows.my();
                const ctx = localWindow.context;
                const uniqueName = "filteredGrid" + this.contextId;
                window.glue.contexts.set(uniqueName, {
                    filter: this.temporaryData,
                    name: uniqueName
                });
                console.log("",window.glue.windows.my().context)
                let appContext = {
                    localContext: ctx,
                    contextName: uniqueName,
                    filter: this.temporaryData
                };
                newChart.start(appContext);
            }
        }

        })
    }
}

export default plugin