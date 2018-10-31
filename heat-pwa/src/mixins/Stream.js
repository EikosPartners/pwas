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
                console.log(stream)
                this.setStream(stream)
            })

        }, 
        subscribeToStream(){
            glue.agm.subscribe(
                "TestStream")
                .then((subscription) => {
                    // use subscription
                    console.table("Methods", glue.agm.methods())

                    console.log("New Subscription",subscription)
                    subscription.onData((streamData)=>{
                        console.log("New Data Recieved", streamData)
                        this.dataRecievedNotification()
                    })
                })
                .catch((error) => {
                    // subscription rejected or failed
                    console.log("Error: ", error)
                });
        },
        publishToStream(){
            console.log("publish to stream")
            const data = {content: "test"}
            this.stream.push(data)
        }
    }
}