let mongoose = require("mongoose");

let NoteSchema = new mongoose.Schema ({
    title: String,
    body: String
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;