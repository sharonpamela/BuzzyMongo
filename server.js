

let logger = require("morgan");
var mongojs = require("mongojs");
let mongoose = require("mongoose");
let db = require("./models");
let axios = require("axios");
let cheerio = require("cheerio");

let PORT = process.env.PORT || 3000;


let express = require("express");
let app = express();


// Set Handlebars.
let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// use morgan logger for all requests
app.use(logger("dev")); 

// parse all responses as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public")); // make public a static folder so that it becomes the default route

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedquotes";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


//routes


app.get("/scrape", function (req, res) {
    axios.get("https://www.goodreads.com/quotes/tag/inspiration")
        .then(function (response) {
            let $ = cheerio.load(response.data);

            $(".quoteText").each(async function (i, element) {
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

// initPage() rendering already scraped quotes
app.get("/quotes", (req, res) => {
    // only render if they have saved:false flag
    db.Quote.find({ saved: false })
        .then(dbQuote => { res.json(dbQuote) })
        .catch(err => { res.json(err) });
});

app.delete("/deleteAll/", async (req, res) => {
    
    try {
        const deleteQuotes = await db.Quote.deleteMany({});
        const deleteNotes = await db.Note.deleteMany({});
        console.log(deleteQuotes);
        console.log(deleteNotes);
        res.send("Deleted all entries.")
    }
    catch (err) {
        res.json(err) 
    }
    
});

app.get("/quotes/:id", (req, res) => {
    db.Quote.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbArticle => { res.json(dbArticle) })
        .catch(err => { res.json(err) })
});



app.post("/update/:id", function (req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))

    // Update the note that matches the object id
    db.Quote.update (
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            // parameters to update
            $set: { saved: true }
        },
        function (error, edited) {
            // Log any errors from mongojs
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                // Otherwise, send the mongojs response to the browser
                // This will fire off the success function of the ajax request
                console.log(edited);
                res.send(edited);
            }
        }
    );
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

app.listen(PORT, function () {
    console.log("app running on port " + PORT + "!");
})

