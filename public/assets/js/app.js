$(document).ready(function () {

    // Adding event listeners for dynamically generated buttons
    $(document).on("click", ".quoteGet", handleQuoteScrape); // button: Get new Quotes!
    $(document).on("click", ".quoteSave", handleQuoteSave); // button: Save Quote
    $(document).on("click", ".quoteClear", handleQuoteClear); // button: Clear Quotes!
    $(document).on("click", ".delete", handleQuoteDelete); // remove single quote from saved
    $(document).on("click", ".notes", handleDisplayQuoteNotes); // display modal for notes 
    $(document).on("click", ".save", handleNoteSave); // save note btn inside modal 
    $(document).on("click", ".note-delete", handleNoteDelete); // delete single note from quote notes

    async function handleQuoteScrape() {
        try {
            await $.ajax({
                method: "GET",
                url: "/scrape"
            })

        } catch (err) {
            console.log(err);
        }

        window.location.reload();
        window.location.reload();
    }

    async function handleQuoteSave() {
        let thisId = $(this).attr("data-id");
        try {
            // send saved quote to db
            await $.ajax({
                method: "POST",
                url: "/update/" + thisId,
                data: {
                    id: thisId
                }
            })
        } catch (err) {
            console.log(err);
        }
        // remove card div
        $(this).parent().parent().remove();
    }

    async function handleQuoteClear() {
        try {
            // delele all of the quotes
            $.ajax({
                method: "DELETE",
                url: "/deleteAll/"
            })
        } catch (e) {
            console.log(e);
        }
        window.location.reload();
    }

    async function handleQuoteDelete() {

        let thisId = $(this).attr("data-id");
        try {
            await $.ajax({
                method: "DELETE",
                url: "/deleteOne/" + thisId
            })
        } catch (e) {
            console.lof(e);
        }
        // remove card div
        $(this).parent().parent().remove();
    }

    async function handleDisplayQuoteNotes() {
        // This function handles opening the notes modal and prepping it up for showing notes
        const noteId = $(this).attr("data-id");

        try {
            // Grab any notes with this quote id
            const dbNoteData = await $.get("/api/notes/" + noteId);

            // Constructing our initial HTML to add to the notes modal
            var modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For Article: " + noteId),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save btnSaveNote'>Save Note</button>")
            );

            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                size: 'large',
                centerVertical: true,
                message: modalText,
                closeButton: true
            });

            let noteData = {
                _id: noteId,
                notes: dbNoteData || []
            };

            // Adding some information about the article and article notes to the save button for easy access when adding a new note
            $(".save").data("quote", noteData);

            // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
            renderNotesList(noteData);

        }
        catch (err) {
            console.log(err);
        }
    }

    function renderNotesList (data) {
        // This function handles rendering note list items to our notes modal
        // Setting up an array of notes to render after finished
        // Also setting up a currentNote variable to temporarily store each note

        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            // If we have no notes, just display a message explaining this
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        } else {
            // If we do have notes, go through each one
            for (var i = 0; i < data.notes.length; i++) {
                // Constructs an li element to contain our noteText and a delete button
                currentNote = $("<li class='list-group-item note'>")
                    .text(data.notes[i].noteText)
                    // Store the note id on the delete button for easy access when trying to delete
                    .append($(`<button class='btn btn-danger note-delete' data-id =${data.notes[i]._id} >x</button>`));
                // Adding our current Note to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    async function handleNoteSave() {
        // This function handles what happens when a user tries to save a new note for an article
        // Setting a variable to hold some formatted data about our note,
        // grabbing the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        // If we actually have data typed into the note input field, format it
        // and post it to the "/api/notes" route and send the formatted noteData as well
        if (newNote) {
            noteData = { _quoteId: $(this).data("quote")._id, noteText: newNote };
            try {
                await $.post("/api/notes/", noteData);
            }
            catch (err) {
                console.log(err);
            }
            // When complete, close the modal
            bootbox.hideAll();
        }
    }

    async function handleNoteDelete() {
        
        const id = $(this).attr("data-id");
        try {
            // remove the note from the DB
            await $.ajax({
                method: "DELETE",
                url: "/deleteOneNote/" + id
            });

            // remove the note from the page (which includes the button)
            $(this).parent().remove();
        }
        catch (err) {
            console.log(err);
        }
    }
}) // end doc ready function