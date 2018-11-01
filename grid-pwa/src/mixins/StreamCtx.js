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
                window.glue.contexts.update("Streams",{streams: [stream.name]} )
                console.log(stream)
                this.setStream(stream)

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
                    console.log("stream",stream)
                    if(stream === undefined){
                        this.createStream()
                        context.update("StreamsCtx", {streams: "TestStream"})
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
        subscribeToStream(){
            if (window.glue !== undefined){
                if (this.checkContext("StreamsCtx")===false){
                    console.log("Creating StreamsCtx")
                    window.glue.contexts.set("StreamsCtx", {streams: ["0"]} )
                }
                this.subscribe("StreamsCtx", (context, delta, removed) =>{
                    console.log("Subscribed to StreamsCtx")
                    const stream = context.streams.find((s)=>{
                        return s === "TestStream"
                     })
                    if(stream !== undefined){
                        console.log("TestStream found in StreamsCtx")
                        window.glue.agm.subscribe("TestStream")
                        .then((subscription) => {
                            console.log("Sbscribed to TestStream", subscription)
                            subscription.onData((streamData)=>{
                                console.log("New Data Recieved", streamData)
                            })
                        })
                        .catch((error) => {
                            console.log("Error: ", error)
                        });

                    }
                })

            }
        },
    }
}
