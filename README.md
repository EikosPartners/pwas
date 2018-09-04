# pwas

PWA's separation of UI's into micro applications

# Setup 

Before running the PWAs, be sure to run `npm install` in each of the top level folders before running them individually. 

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

``` bash
$npm run build
```

Finally, use **http-server** to run each PWA independently:

```bash
$ http-serve dist/
```

This will run the PWAs on different local host ports and provide PWA offline functionality. 


