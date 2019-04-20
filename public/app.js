$(document).ready(function () {


    var quoteContainer = $(".quoteContainer");

    // Adding event listeners for dynamically generated buttons for deleting quotes,
    // fetching, saving, and deleting quote notes

    $(document).on("click", ".quoteGet", handleQuoteScrape); // button: Get new Quotes!
    $(document).on("click", ".quoteSave", handleQuoteSave); // button: Save Quote
    $(document).on("click", ".quoteClear", handleQuoteClear); // button: Clear Quotes!
    // $(document).on("click", ".btn.save", handleNoteSave);
    // $(document).on("click", ".btn.delete", handleQuoteDelete);
    // $(document).on("click", ".btn.notes", handleQuoteNotes);
    // $(document).on("click", ".btn.note-delete", handleNoteDelete);
    // $(".clear").on("click", handleQuoteClear);

    // initialize the first time page loads
    initPage();

    function initPage() {
        // Empty the article container, run an AJAX request for any saved quotes
        $.get("/quotes").then(function (data) {
            quoteContainer.empty();

            // If we have quotes, render them to the page
            if (data && data.length) {
                renderQuotes(data);
            } else {
                // Otherwise render a message explaining we have no quotes
                renderEmpty();
            }
        });
    }

    function renderQuotes(quotes) {
        var quoteCards = [];
        // We pass each quote JSON object to the createCard function which returns a bootstrap card with our quote data inside
        for (var i = 0; i < quotes.length; i++) {
            quoteCards.push(createCard(quotes[i]));
        }
        quoteContainer.append(quoteCards);
    }

    function createCard(quote) {
        // This function takes in a single JSON object for a quote
        // Constructs a jQuery element containing all of the formatted HTML for the quote card
        var card = $("<div class='card cardStyle'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                // $("<a class='quote-link' target='_blank' rel='noopener noreferrer'>").text("Quote"),
                $(`<a class="btn btn-success btn-sm quoteSave" data-id='${quote._id}'>Save Quote</a>`)
                // $("<a class='btn btn-danger btn-sm delete'>Delete From Saved</a>"),
                // $("<a class='btn btn-info btn-sm notes'>Notes</a>")
            )
        );
        var cardBody = $("<div class='card-body'>").text(quote.quote);
        card.append(cardHeader, cardBody);
        card.data("_id", quote._id);
        return card;
    }

    function renderEmpty() {
        // This function renders some HTML to the page explaining we don't have any articles to view
        // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Click on 'Get New Quotes!' to get started.</h4>",
                "</div>"
            ].join("")
        );
        // Appending this data to the page
        quoteContainer.append(emptyAlert);
    }


    function handleQuoteScrape() {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
            .then(function (data) {
                // render new quotes after fetching the quotes completes
                initPage();
            });
    }

    function handleQuoteSave() {
        let thisId = $(this).attr("data-id");

        // send saved quote to db
        $.ajax({
            method: "POST",
            url: "/update/" + thisId,
            data: {
                id: thisId
            }
        })
            .then(function (data) {
                // remove saved card from the page
                initPage();
            });

    }

    function handleQuoteClear() {

        // delele all of the quotes
        $.ajax({
            method: "DELETE",
            url: "/deleteAll/"
        }).then(function (data) {
            
            initPage();
            
        });

    }
}) // end doc ready function