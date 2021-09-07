const dotenv = require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();
const path = require("path");
const usersRoutes = require("./routes/usersRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const remarksRoutes = require("./routes/remarksRoutes");
const likesRoutes = require("./routes/likesRoutes");
var cors = require("cors");


app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(helmet());
//app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/remarks", remarksRoutes);
app.use("/api/likes", likesRoutes);

// app.use('/', function(req, res) {
//     res.status(200).send('<h1>Bonjour sur mon super server</h1>');
// });

process.on("warning", (warning) => {
    console.log(warning.stack);
});
module.exports = app;