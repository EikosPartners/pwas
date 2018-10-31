// Notifications Mixin
// Used for testing purposes

export default {
    methods:{
        testNotification(){
            glue.agm.invoke(
                'T42.GNS.Publish.RaiseNotification', {
                notification: {
                    title: 'Critical Alert',
                    severity: 'High',
                    description: 'Your machine is going to be restarted in 30 seconds'
                }
            })
            .then(() => console.log('Raised notification'))
            .catch(console.error);
        },
        dataRecievedNotification(){
            glue.agm.invoke(
                'T42.GNS.Publish.RaiseNotification', {
                    notification:{
                        title: "Data Recieved",
                        severity: "High",
                        description: "data"
                    }
                }

            ).then(console.log("Data Received Notification"))
        }
    }
}