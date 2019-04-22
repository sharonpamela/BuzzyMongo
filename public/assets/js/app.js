$(document).ready(function () {

    //  todo:
    // render Empty


    var quoteContainer = $(".quoteContainer");

    // Adding event listeners for dynamically generated buttons
    $(document).on("click", ".quoteGet", handleQuoteScrape); // button: Get new Quotes!
    $(document).on("click", ".quoteSave", handleQuoteSave); // button: Save Quote
    $(document).on("click", ".quoteClear", handleQuoteClear); // button: Clear Quotes!
    $(document).on("click", ".delete", handleQuoteDelete); // remove single quote from saved
    $(document).on("click", ".notes", handleDisplayQuoteNotes); // display modal for notes 
    $(document).on("click", ".save", handleNoteSave); // save note btn inside modal 
    $(document).on("click", ".note-delete", handleNoteDelete); // delete single note from quote notes

    // function to re-render the page when an event happens
    function renderPage(page) {
        $.get(page).then(function (data) {
            // console.log("Done");
        });
    }


    // function initSavedPage() {
    //     // Empty the article container, run an AJAX request for any saved quotes
    //     $.get("/renderSaved").then(function (data) {
    //         quoteContainer.empty();

    //         // If we have quotes, render them to the page
    //         if (data && data.length) {
    //             savedRenderQuotes(data);
    //         } else {
    //             // Otherwise render a message explaining we have no quotes
    //             savedRenderEmpty();
    //         }
    //     });
    // }

    // function initHomePage() {
    //     // Empty the article container, run an AJAX request for any saved quotes
    //     $.get("/").then(function (data) {
    //         quoteContainer.empty();

    //         // If we have quotes, render them to the page
    //         if (data && data.length) {
    //             renderQuotes(data);
    //         } else {
    //             // Otherwise render a message explaining we have no quotes
    //             renderEmpty();
    //         }
    //     });
    // }

    //  ***** init home page helpers  *****
    // function renderQuotes(quotes) {
    //     var quoteCards = [];
    //     // We pass each quote JSON object to the createCard function which returns a bootstrap card with our quote data inside
    //     for (var i = 0; i < quotes.length; i++) {
    //         quoteCards.push(createCard(quotes[i]));
    //     }
    //     quoteContainer.append(quoteCards);
    // }

    // function createCard(quote) {
    //     // This function takes in a single JSON object for a quote
    //     // Constructs a jQuery element containing all of the formatted HTML for the quote card
    //     var card = $("<div class='card cardStyle'>");
    //     var cardHeader = $("<div class='card-header'>").append(
    //         $("<h3>").append(
    //             $(`<a class="btn btn-success btn-sm btnCard quoteSave" data-id='${quote._id}'>Save Quote</a>`)
    //         )
    //     );
    //     var cardBody = $("<div class='card-body'>").text(quote.quote);
    //     card.append(cardHeader, cardBody);
    //     card.data("_id", quote._id);
    //     return card;
    // }

    // function renderEmpty() {
    //     // This function renders some HTML to the page explaining we don't have any articles to view
    //     // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    //     var emptyAlert = $(
    //         [
    //             "<div class='alert alert-warning text-center'>",
    //             "<h4>Click on 'Get New Quotes!' to get started.</h4>",
    //             "</div>"
    //         ].join("")
    //     );
    //     // Appending this data to the page
    //     quoteContainer.append(emptyAlert);
    // }
    //  ***** END: init home page helpers  *****


    //  ***** init saved page helpers  *****
    // function savedRenderQuotes(quotes) {
    //     var quoteCards = [];
    //     // We pass each quote JSON object to the createCard function which returns a bootstrap card with our quote data inside
    //     for (var i = 0; i < quotes.length; i++) {
    //         quoteCards.push(savedCreateCard(quotes[i]));
    //     }
    //     quoteContainer.append(quoteCards);
    // }

    // function savedCreateCard(quote) {
    //     // This function takes in a single JSON object for a quote
    //     // Constructs a jQuery element containing all of the formatted HTML for the quote card
    //     var card = $("<div class='card cardStyle'>");
    //     var cardHeader = $("<div class='card-header'>").append(
    //         $("<h3>").append(
    //             $(`<a class='btn btn-danger btnCard btn-sm delete' data-id='${quote._id}'>Delete From Saved</a>`),
    //             $(`<a class='btn btn-info btnCard btn-sm notes' data-id='${quote._id}'>Notes</a>`)
    //         )
    //     );
    //     var cardBody = $("<div class='card-body'>").text(quote.quote);
    //     card.append(cardHeader, cardBody);
    //     card.data("_id", quote._id);
    //     return card;
    // }

    // function savedRenderEmpty() {
    //     // This function renders some HTML to the page explaining we don't have any articles to view
    //     // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    //     var emptyAlert = $(
    //         [
    //             "<div class='alert alert-warning text-center'>",
    //             "<h3>Oh oh ~There are no saved quotes at the moment.</h3>",
    //             "<h4> Quotes can be saved from the <a href='/'>Home</a> page.</h4>",
    //             "</div>"
    //         ].join("")
    //     );
    //     // Appending this data to the page
    //     quoteContainer.append(emptyAlert);
    // }
    //  ***** END: init saved page helpers  *****

    function handleQuoteScrape() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
            .then(function (data) {
                // render new quotes after fetching the quotes completes
                window.location.reload();
            });
    }

    async function handleQuoteSave() {
        let thisId = $(this).attr("data-id");
        console.log("the ID is:", thisId);
        // send saved quote to db
        await $.ajax({
            method: "POST",
            url: "/update/" + thisId,
            data: {
                id: thisId
            }
        })
        $(this).parent().parent().remove();
        // window.location.reload();
        // renderPage("/");
    }

    function handleQuoteClear() {

        // delele all of the quotes
        $.ajax({
            method: "DELETE",
            url: "/deleteAll/"
        }).then(function (data) {

            window.location.reload();
            // renderPage("/");

        });

    }

    async function handleQuoteDelete() {

        let thisId = $(this).attr("data-id");

        await $.ajax({
            method: "DELETE",
            url: "/deleteOne/" + thisId
        })
        // initSavedPage();
        // window.location.reload();
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

    function renderNotesList(data) {
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
                const notePostResult = await $.post("/api/notes/", noteData);
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

        // remove the note from the DB
        try {
            const notePostResult = await $.ajax({
                method: "DELETE",
                url: "/deleteOneNote/" + id
            });

            // remove the note from the page (which includes the button)
            $(this).parent().remove();

            console.log(notePostResult);

        }
        catch (err) {
            console.log(err);
        }
    }
}) // end doc ready function