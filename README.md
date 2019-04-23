
# All the News That's Fit to Scrape

### Overview

This web app scrapes the https://www.goodreads.com/quotes/tag/inspiration website for quotes and displays each of the quotes in cards to allow users to view and leave notes/comments on the quotes they like.

### Technologies Used

   1. express

   2. express-handlebars

   3. mongoose

   4. cheerio

   5. axios
   
   6. Heroku

### Accessing the app

This app is deployed at the following Heroku link:
https://quotescraperucb.herokuapp.com/

### Using the app

Home page:

Button 1: Get New Quotes!
This triggers the page to scrape quotes and then displays them on the page. A manual refresh may be needed sometimes to see the scraped quotes. 

Button 2: Clear Quotes!
Empty the DB from all the quotes scraped. Deletes the saved quotes as well and all related comments users have done on the quotes. 

Button 3: Save Quote
Adds the relevant quote to the "saved" list for quick find and future review.

Saved Quotes Page:

Button 1: Clear Quotes!
Empty the DB from all the quotes scraped. Deletes the saved quotes and all related comments users have done on the quotes. 

Button 2: Delete from Saved
Deletes a single quote from the saved list (and DB).

Button 3: Notes
Triggers modal for users to leave a note. 
   
   Notes' Modal:
   - Displays all previous comments about this particular quote.
   - New Note text are allows users to enter a new note/comment. 
   - Save Note: saves the note/comment.
   - X exits the modal.



