import { useCallback, useEffect, useState } from "react";
import Spinner from 'react-spinner-material';

// import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NavBar from "../components/NavBar";

function ListAllBooks() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shelfNum = parseInt(searchParams.get('shelf'));
    const [books, setBooks] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuthContext();

    const fetchBooks = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/see-all?shelf=${shelfNum}&page=${page}&limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
                setIsLoading(false);
                setBooks(data.books);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        },
        [user, shelfNum, page, limit],
    )

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    return <>
        <NavBar />
        {isLoading ? (
            <div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>
        ) : (
            <div>
                <h1>All books on {shelfNum === 0
                    ? 'Want to read'
                    : shelfNum === 1
                        ? 'Currently reading'
                        : shelfNum === 2
                            ? 'Read'
                            : 'Unknown Shelf'}</h1>
                {console.log(shelfNum)}
                {books && books.map(book => {
                    return (
                        <div key={book._id}>
                            <p>{book.title}</p>
                        </div>
                    )
                })}
                <div className="pagination">
                    {page > 1 && (
                        <button onClick={() => setPage(page - 1)}>Previous</button>
                    )}
                    <span>Page {page} of {totalPages}</span>
                    {page < totalPages && (
                        <button onClick={() => setPage(page + 1)}>Next</button>
                    )}
                </div>
            </div>
        )}
    </>
}

export default ListAllBooks;