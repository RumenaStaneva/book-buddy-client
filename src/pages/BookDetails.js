import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';
import '../styles/BookDetails.css'

function BookDetails() {

  const [isLoading, setIsLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState(null);
  const { user } = useAuthContext();
  const params = useParams();

  useEffect(() => {
    document.title = `Book details`;
  }, []);

  const fetchBooks = useCallback(
    async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/book-details?bookId=${params.bookId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        console.log(data.book);
        setBookDetails(data.book);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching book data:', error);
        setIsLoading(false);
      }
    },
    [user],
  )

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user, fetchBooks]);

  return (
    <>
      <NavBar />
      {isLoading ? (
        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
      ) : (
        <>
          <Header title='Book Details' />
          <div className="book-details-container">
            {bookDetails !== null ? (
              <div className="book-card">
                <div className="book-thumbnail">
                  <img
                    src={bookDetails.thumbnail}
                    alt={`Thumbnail for ${bookDetails.title}`}
                  />
                </div>
                <div className="book-details">
                  <h2 className="book-title">{bookDetails.title}</h2>
                  <p className="book-category">{bookDetails.category}</p>
                  <p className="book-description">{bookDetails.description}</p>
                  <p className="book-authors">
                    Authors: {bookDetails.authors.join(', ')}
                  </p>
                </div>
              </div>
            ) : (
              <h2>Nothing to see here</h2>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default BookDetails;
