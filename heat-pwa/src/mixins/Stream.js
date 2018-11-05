// Stream Mixin
// Used for testing purposes

export default {
    methods: {
        createStream(){
            glue.agm.createStream({
                name: 'TestStream',
                displayName: 'Publishes last trades for a symbol',
                objectTypes: ['Symbol'],
                accepts: 'String symbol',
                returns: 'get'
            })
            .then((stream)=>{
                window.glue.contexts.update("StreamsCtx",{streams: [stream.name]} )
                console.log(stream)
                this.setStream(stream)
                stream.subscriptionsAddHandler(sub=>{
                    console.log(sub)
                })

            })

        }, 
        publishToStream(){
            console.log("publish to stream")
            const data = {content: "test"}
            this.stream.push(data)
        
        },
        handleStream(){
            if(window.glue !== undefined){
                if (this.checkContext("StreamsCtx")===false){
                    window.glue.contexts.set("StreamsCtx", {streams: ["0"]} )
                }
                console.log("hi")
                this.subscribe("StreamsCtx", (context, delta, removed) =>{
                    console.log("Context",context)
                    const stream = context.streams.find((s)=>{
                       return s === "TestStream"
                    })
                    if(stream === undefined){
                        console.log("stream not yet created",stream)
                        this.createStream()
                        // context.update("StreamsCtx", {streams: "TestStream"})
                    }
                })
            }
        },
        checkContext(context){
            const contexts = window.glue.contexts.all()
            const streamCtx = contexts.find((c)=>{
                return c === context
            })
            console.log(streamCtx)
            if (streamCtx){
                return true
            }
            return false
        },

        
        removeFromStreamsCtx(name){
            console.log("Remove From Stream Context", name)
            window.glue.contexts.update("StreamsCtx", {streams: []})
        }
        // subscribeToStream(){
        //     if (window.glue !== undefined){

        //         window.glue.agm.subscribe("TestStream")
        //         .then((subscription) => {
        //             console.table("Methods", glue.agm.methods())

        //             console.log("New Subscription",subscription)
        //             subscription.onData((streamData)=>{
        //                 console.log("New Data Recieved", streamData)
        //                 this.dataRecievedNotification()
        //             })
        //         })
        //         .catch((error) => {
        //             // subscription rejected or failed
        //             console.log("Error: ", error)
        //         });

        //     }
        // },
    }
}