# Check out our new [Wiki](https://github.com/EikosPartners/pwas/wiki)
## pwas

PWA's separation of UI's into micro applications

## Table of Contents

[Setup](https://github.com/EikosPartners/pwas/blob/master/README.md#setup)

[Testing](https://github.com/EikosPartners/pwas/blob/master/README.md#testing)

[PWAs](https://github.com/EikosPartners/pwas/blob/master/README.md#pwas)

[Dev Build](https://github.com/EikosPartners/pwas/blob/master/README.md#dev-build)

- [To Build](https://github.com/EikosPartners/pwas/blob/master/README.md#to-build)
    
- [To Run](https://github.com/EikosPartners/pwas/blob/master/README.md#to-run)
  
[Running Individual PWAs](https://github.com/EikosPartners/pwas/blob/master/README.md#running-individual-pwas)

- [Packages](https://github.com/EikosPartners/pwas/blob/master/README.md#packages)

    - [Nodemon](https://github.com/EikosPartners/pwas/blob/master/README.md#nodemon)
    
    - [HTTP-Server](https://github.com/EikosPartners/pwas/blob/master/README.md#http-server)
 
[Communication Between PWAs](https://github.com/EikosPartners/pwas/blob/master/README.md#communication-between-pwas)

- [Socket.io](https://github.com/EikosPartners/pwas/blob/master/README.md#socket.io)



# Setup

To install all dependencies from the root PWA folder, run

```bash
$ npm install
$ npm run install-all
```

To install dependencies for an individual PWA you can use `npm run install-[folder-name]`. For example, to install dependencies for **Bar PWA**, you would run

```bash
$ npm run install-bar-pwa
```

To update dependencies for each PWA from the root folder, run

```bash
$ npm run update-all
```
This will run `npm update` in each individual PWA folder. If you only want to update one PWA, you can do so from the root folder as well as from the specific PWA folder:

```bash
// Update from the root
$ npm run update-heat-pwa
// Update from the PWA folder
$ cd heat-pwa
$ npm update
```

# Testing

To run tests on each PWA from the root folder:

```bash
$ npm run test-all
```

To run tests on a specific PWA from the root folder:


```bash
$ npm run test-heat-pwa
```

# PWAs

To begin the backend server from the route directory run

```bash
npm run server
```

To run a specific UI from the root folder, you may use the command `npm run [folder-name]`. For example, to run **Grid PWA** on a dev server, you would run the following command.

```bash
$ npm run grid-pwa
```

to start dev servers for all UI's you can use

```bash
$ npm run serve-all
```

The PWAs will be available on the following ports:

- bubble-pwa Port: 8081
- graph-pwa Port: 8082
- grid-pwa Port: 8083
- heat-pwa Port: 8084
- pie-pwa Port: 8085

## Dev Build

#### To Build

To build a specific PWA from the root folder, you can run
the command `npm build-[folder-name]`. For example, to build **Heat PWA**, you would run the following command.

```bash
$ npm run build-heat-pwa
```

to build app PWAs at once you can run the following command. (It will take a few minutes)

```bash
$ npm run build-all
```

#### To Run

To run the built versions of the PWAs, you must start the backend server, like before.

```bash
$ npm run server
```

And then you can start the individual PWAs with `npm run [folder-name]-built`

```bash
$ npm run heat-pwa-built
```

You can also run all PWAs with a single command by runnign

```bash
$ npm-run-all-built
```

The PWAs will be available on the following ports:

- bar-pwa Port: 5000
- bubble-pwa Port: 5001
- graph-pwa Port: 5002
- grid-pwa Port: 5003
- heat-pwa Port: 5004
- pie-pwa Port: 5005

# Running Individual PWAs

## Packages

### nodemon

[Nodemon](https://nodemon.io/) is a utility that will monitor any changes in your source and automatically resart your server.

Install **nodemon** using npm:

```bash
$ npm install -g nodemon
```

Start the server using the **nodemon** instead of **node**:

```
$ nodemon <your-app-file>
```

The server will run on `localhost:9000`

### http-server

[HTTP-Server](https://www.npmjs.com/package/http-server) is a "simple, zero-configuration command-line http server." We use **http-server** to run our current priduction build of each PWA.

Install **http-serve** using npm:

```bash
$ npm install http-server -g
```

This will install the package gloablly so it can be run in your console if you havebn't installed this package before.

Next, build the production version of each PWA (not the server):

```bash
$ npm run build
```

Finally, use **http-server** to run each PWA independently:

```bash
$ http-serve dist/
```

This will run the PWAs on different local host ports and provide PWA offline functionality.

# Communication Between PWAs


## Socket.io

[Socket.io](https://socket.io/) enables real-time, bidirectional and event-based communication.

Messages are sent to through Socket.io from one PWA to another to communicate event-based changes.

## Messages 

To maintain functional communication between PWAs we have established a standard message structure:

```
{
    source: "BubbleChart",
    dataSource: "/",
    data: <data you wish to filter by>

}
```
By building messages using this standardized structure, processing the messages is made simple. This means that the message must convey an intended behavior by passing a specific piece of data and using the appropriate message type.

### Message Types

Message types inform the reciever how to handle a given message. 

#### Filter

- **filterByDate**

    Requires a *date* string passed into message.data key

- **filterByProject**

    Requires a *project* string passed into message.data key

- **filterBySeverity**

    Requires a *severity* number passed into message.data key

- **filterByRaisedBy**

    Requires a *raisedBy* string passed into message.data key



