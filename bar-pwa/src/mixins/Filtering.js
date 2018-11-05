export default {
    methods:{
        handleShiftClick(click){
            if (click.shiftKey){
                return true
            }
            return false
        },

        handleFilterOnGrid(){
            if(this.verifyNewContextID()){
                const uniqueID = Date.now()
                const contextID = 'filterOnGrid' + uniqueID
                this.setFilterOnGridID(contextID)
            }
        },
        verifyNewContextID(){
            if(this.filterOnGridID === null){
              return true
            }
            let context = this.filterOnGridID
            const windowsList = glue.windows.list()
            let window = windowsList.find(w=>{
              return w.context.eventName === context
            })
            if (window){
              
              return false
            }
            this.gridInstance = false
            return true
        },
        manageContextWindow(filter, eventName){
      
            if (this.gridInstance === true) {
      
              // Can we pass the instance an updated context here?
            } else {
              let app = window.glue.appManager.application('JSCDataGrid');
              const localWindow = window.glue.windows.my();
              const localThis = this;
              let windowConfig = {
                relativeTo: localWindow.id,
                relativePosition: 'right'
              };
              // let windowConfig = { }
      
              // Launch the app and then wait for the return so that we can grab the instance Id
              app
                .start({ filter, eventName }, windowConfig)
                .then(instance => {
                  //localThis.gridInstance = instance
                });
      
              this.gridInstance = true;
            }
        },


    }
}