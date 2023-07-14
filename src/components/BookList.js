import React from 'react';

function BookList({ books }) {
    return (
        <div>
            {books.map(book => (
                <div key={book.id}>
                    <h2>{book.volumeInfo.title}</h2>
                    <p>{book.volumeInfo.authors}</p>
                    <p>{book.volumeInfo.description}</p>
                    <img src={
                        book.volumeInfo.imageLinks === undefined
                            ? ""
                            : `${book.volumeInfo.imageLinks.thumbnail}`
                    } alt={`${book.volumeInfo.title} image`} />
                </div>
            ))}
        </div>
    );
}

export default BookList;