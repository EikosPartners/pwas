export default {
    data(){
      return {
        temporaryWindow: null
      }
    },
    methods: {
        handleShiftClick(click){
            if (click.shiftKey){
                return true
            }
            return false
        },
        handleFilterOnGrid(data){
          if (window.glue) {
            if(this.verifyNewContextID()){
              const uniqueID = Date.now()
              const contextID = 'filterOnGrid'+ uniqueID
              this.setFilterOnGridID(contextID)
            }
          } else {
            if (!this.$store.state.filterOnGridID) {
              // if no child grid / context opened yet, open one
              this.temporaryWindow = window.open('', '_blank')
              this.$socket.emit('appManager', {to: 'JSCDataGrid', from: 'JSCBubbleChart'}) 
              this.gridInstance = true
            } else {
              // if there is a child grid / context open, send the updated data 
              this.$socket.emit(this.$store.state.filterOnGridID + 'dataToServer', JSON.stringify(data))
            }
          }
        },
        handleStandAloneGrid(){
          // opens a new grid / context for a standalone (shift clicked) instance  
          this.temporaryWindow = window.open('', '_blank')
          this.$socket.emit('appManager', {to: 'JSCDataGrid', from: 'JSCBubbleChart', shift: true}) 
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
              if (window.glue) {
                let app = window.glue.appManager.application('JSCDataGrid');
                const localWindow = window.glue.windows.my();
                const localThis = this;
                let windowConfig = {
                  relativeTo: localWindow.id,
                  relativePosition: 'right'
                };
        
                console.log(this.filterOnGridID)
                
                app
                  .start({ filter, eventName }, windowConfig)
                  .then(instance => {
                    //localThis.gridInstance = instance
                   
                  });
                
                this.gridInstance = true;

              }
          }
      },
    },
    // computed: {

    // },
    sockets: {
     
    }
}