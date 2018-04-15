//require express and handlebars.
const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

//create express app
var app = express();

//register partials
hbs.registerPartials(__dirname + "/views/partials")
app.set("view engine", "hbs");

//middle ware - loggers etc.
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: method used - ${req.method} : url requested - ${req.url}`;
    console.log(log);
    fs.appendFileSync("server.log", log + "\n", (err) => {
        if(err){
            console.log("Unable to write to the log file.");
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render("maintenance.hbs");
// });

app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear()
});

hbs.registerHelper("capitalize", (text) => {
    return text.toUpperCase();
});

app.get("/", (req, res) => {
    res.render("home.hbs",{
        pageTitle: "Home page",
        welcomeMessage: "Welcome home!!!"
    });
});

//Create a get request for the about page.
app.get("/about", (req, res) => {
    res.render("about.hbs", {
        pageTitle: "About page from exp.",
        welcomeMessage: "This is the about page!"
    });
});


//Create a route for bad request, send back JSON with error message.
app.get("/bad", (req, res) => {
    res.send({
        error: "Bad request found."
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});