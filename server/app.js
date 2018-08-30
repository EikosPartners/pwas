let express = require("express");
let helmet = require("helmet");
let app = express();
let cors = require("cors");

let http = require("http");

let index = require("./routes/");
app.use(cors());
app.use(helmet());

app.use("/", index);

let server = http.createServer(app);

server.listen(9000);
