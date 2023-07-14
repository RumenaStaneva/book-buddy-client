import React, { useEffect, useState } from 'react';
import axios from "axios";


function BooksComponent() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const url = `https://www.googleapis.com/books/v1/volumes?q=под-игото&maxResults=40&printType=books&key=AIzaSyC3fIFjfUA1ndnDh2SHArvibKwC-bBJgXg`;
        const fetchData = async () => {
            const response = await axios.get(url);
            await console.log(response.data.items);
            setBooks((response.data.items));
            console.log(response.data.items[0].volumeInfo.imageLinks.thumbnail);
        };

        fetchData();
    }, []);


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
                    } alt="Book Thumbnail" />
                </div>
            ))}
        </div>
    );
}

export default BooksComponent;
