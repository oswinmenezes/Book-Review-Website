# Book Review Website

A web application for exploring, reviewing, and managing books. Users can browse books by genre, read summaries, add new books, and edit or delete reviews. The site integrates data from the Open Library API to fetch book details.

## Features

* Browse all books with summaries and ratings.
* Search books by genre.
* Add new books and reviews.
* Edit or delete existing book entries.
* Fetch book cover and author information automatically via Open Library API.
* Responsive and user-friendly interface.

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Frontend:** EJS templates, HTML, CSS, JavaScript
* **APIs:** Open Library API for book data

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up PostgreSQL database:

   ```sql
   CREATE DATABASE Books;
   CREATE TABLE books (
       id SERIAL PRIMARY KEY,
       book_title TEXT,
       summary TEXT,
       rating INTEGER,
       cover_id INTEGER,
       genre VARCHAR(255),
       author_name TEXT
   );
   ```

4. Create a `.env` file in the root directory and add your database credentials:

   ```env
   DB_HOST=localhost
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=Books
   DB_PORT=5432
   ```

5. Run the application:

   ```bash
   nodemon index.js
   ```

6. Open your browser and go to `http://localhost:3000`

## Usage

* Navigate to the homepage to view all books.
* Use the "Add New Book" page to add a book and its review.
* Click on a book to view detailed summary and rating.
* Edit or delete books from the grid page.
* Filter books by genre.

