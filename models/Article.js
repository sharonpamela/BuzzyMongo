let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//first: create and define the schema
let ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId, // stores an object's ID
        ref: "Note" // links object id to the note model
    }
});

// second: create and define the model using the schema created above
let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;


