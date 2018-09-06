# pwas

PWA's separation of UI's into micro applications

# Table of Contents

[Setup](https://github.com/EikosPartners/pwas/edit/master/README.md#setup)

[PWAs and Server](https://github.com/EikosPartners/pwas/edit/master/README.md#pwas-and-server)

[Dev Build](https://github.com/EikosPartners/pwas/edit/master/README.md#dev-build)



# Setup

To install all dependencies from the root PWA folder run

```bash
npm install
npm run install-all
```

To install dependencies for an individual PWA you can use `npm run install-[folder-name]`. For example, to install dependencies for **Bar PWA**, you would run

```bash
npm run install-bar-pwa
```

# PWAs and Server

To begin the backend server from the route directory run

```bash
npm run server
```

To run a specific UI from the root folder, you may use the command `npm run [folder-name]`. For example, to run **Grid PWA** on a dev server, you would run the following command.

```bash
npm run grid-pwa
```

to start dev servers for all UI's you can use

```bash
npm run serve-all
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
npm run build-heat-pwa
```

to build app PWAs at once you can run the following command. (It will take a few minutes)

```bash
npm run build-all
```

#### To Run

To run the built versions of the PWAs, you must start the backend server, like before.

```bash
npm run server
```

And then you can start the individual PWAs with `npm run [folder-name]-built`

```bash
npm run heat-pwa-built
```

You can also run all PWAs with a single command by runnign

```bash
npm-run-all-built
```

The PWAs will be available on the following ports:

- bar-pwa Port: 5000
- bubble-pwa Port: 5001
- graph-pwa Port: 5002
- grid-pwa Port: 5003
- heat-pwa Port: 5004
- pie-pwa Port: 5005

# Individual PWAs

## Server

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

## http-server

[HTTP-Server](https://www.npmjs.com/package/http-server) is a "simple, zero-configuration command-line http server." We use **http-server** to run our current priduction build of each PWA.

Install **http-serve** using npm:

```bash
$ npm install http-server -g
```

This will install the package gloablly so it can be run in your console if you havebn't installed this package before.

Next, build the production version of each PWA (not the server):

```bash
$npm run build
```

Finally, use **http-server** to run each PWA independently:

```bash
$ http-serve dist/
```

This will run the PWAs on different local host ports and provide PWA offline functionality.
