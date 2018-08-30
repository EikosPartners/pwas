let express = require("express");
let helmet = require("helmet");
let app = express();

let http = require("http");

let index = require("./routes/");
app.use(helmet());
app.use("/", index);

let server = http.createServer(app);

server.listen(9000);
