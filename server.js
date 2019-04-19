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

mongoose.connect("mongodb://localhost/scrapedquotes", { useNewUrlParser: true });

//route
app.get("/scrape", function (req, res) {
    axios.get("https://www.goodreads.com/quotes/tag/inspiration")
        .then(function (response) {
            let $ = cheerio.load(response.data);

            $(".quoteText").each( async function (i, element) {
                let result = {};

                result.quote = $(this)
                    .text()
                    .split(",")
                    .join()
                    // .replace(/[\\][n]*/gm," ")
                    .trim();

                // save to db ONLY if the quote is not a repeat
                try {
                    for (quote in result) {
                        const found = await db.Quote.find({ quote: result[quote] });
                    
                        if (found.length === 0) {
                            const created = await db.Quote.create(result);
                            console.log(created);
                        }
                    }
                }
                catch (e) {
                    console.log(e)
                }
            });
            res.send("Scrape Completed!");
        });
});

app.get("/quotes", (req, res) => {
    // note this is using the model ref name 
    db.Quote.find({})
        .then(dbQuote => { res.json(dbQuote) })
        .catch(err => { res.json(err) });
});

app.delete("/deleteAll", (req, res) => {
    db.Quote.remove({})
        .then(res.send("Delete all quotes Completed!"))
        .catch(err => { res.json(err) });

    db.Note.remove({})
        .then(res.send("Delete all notes Completed!"))
        .catch(err => { res.json(err) });
});

app.get("/quotes/:id", (req, res) => {
    db.Quote.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbArticle => { res.json(dbArticle) })
        .catch(err => { res.json(err) })
});

// once a user post a new note
// this creates a new note in the Notes DB
// the ArticleSchema has a note property that associates the id of the note to the article it
// was posted on.
app.post("/quotes/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            db.Quote.findOneAndUpdate(
                { _id: req.params.id }, // id of article
                { note: dbNote._id }, // id of article's notes 
                { new: true })
        })
        .then(dbArticle => { res.json(dbArticle) })
        .catch(err => { res.json(err) });
})

app.listen(port, function () {
    console.log("app running on port " + port + "!");
})

