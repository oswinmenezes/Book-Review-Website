CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    book_title text,
    summary text,
    rating integer,
    cover_id integer,
    genre varchar(255),
    author_name text
)