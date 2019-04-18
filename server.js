let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let db = require("./models");
let axios = require("axios");
let cheerio = require("cheerio");

let port = 3000;
let app = express();

app.use(logger("dev")); // use morgan logger for all requests

// parse all responses as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public")); // make public a static folder so that it becomes the default route

mongoose.connect("mongodb://localhost/scratchscrape", { useNewUrlParser: true });

//route
app.get("/scrape", function (req, res) {
    // url: https://www.goodreads.com/quotes/tag/inspiration

    axios.get("http://www.echojs.com/").then(function (response) {
        let $ = cheerio.load(response.data);

        $("article h2").each(function (i, element) {
            let result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(dbArticle => { console.log(dbArticle) })
                .catch(err => { console.log(err) });
        });
        res.send("Scrape Completed!");
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({})
        .then(dbArticle => { res.json(dbArticle) })
        .catch(err => { res.json(err) });
});

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbArticle => { res.json(dbArticle) })
        .catch(err => { res.json(err) })
});

app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then ( dbArticle => {res.json(dbArticle)} )
        .catch ( err => {res.json(err)} );
})

app.listen(port, function () {
    console.log("app running on port " + port + "!");
})

