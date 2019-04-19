var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//first: create and define the schema
var QuoteSchema = new Schema ({
    quote: {
        type: String,
        unique: true,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId, // stores an object's ID
        ref: "Note" // links object id to the note model
    }
});

// second: compile the model using the schema created above
var Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;


