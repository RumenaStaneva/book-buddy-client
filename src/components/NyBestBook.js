import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';
import { REACT_APP_LOCAL_HOST } from '../functions';
import BookList from './BookList';
import { setError } from '../reducers/errorSlice';

function NyBestBook({ books }) {
    const [bookToSearch, setBookToSearch] = useState('');
    const [booksSearch, setBooksSearch] = useState();
    const PAGE_SIZE = 12;
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async (page, title, retryCount = 0) => {
        setLoading(true);
        try {
            const url = `${REACT_APP_LOCAL_HOST}/api/search-book-title`;
            const response = await axios.post(
                url,
                { title: title, startIndex: (page - 1) * PAGE_SIZE, maxResults: PAGE_SIZE },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setBooksSearch(response.data.items);
            // const calculatedTotalPages = Math.ceil(response.data.totalItems / PAGE_SIZE);
            setTotalPages(Math.ceil(response.data.totalItems / PAGE_SIZE));
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount < 3) {
                // Retry with exponential backoff
                const delay = Math.pow(2, retryCount) * 1000;
                console.log(`Retrying after ${delay} milliseconds...`);
                setTimeout(() => {
                    fetchData(page, title, retryCount + 1);
                }, delay);
            } else {
                setError(`Error fetching books: ${error})`);
                console.error('Error fetching books: ', error);
            }
        } finally {
            setLoading(false);
        }
    };


    console.log(bookToSearch);

    return (
        <div>
            {books.length > 0 && books.map((book) => {
                return (
                    <div key={book.primary_isbn10} onClick={() => fetchData(1, book.title)}>
                        <p>
                            {book.title}
                        </p>
                        <img src={`${book.book_image}`} alt="" />

                    </div>
                )
            })}


            {booksSearch && booksSearch.length !== 0 ?
                <BookList books={booksSearch}
                />
                : null}
        </div>
    )
}

export default NyBestBook;