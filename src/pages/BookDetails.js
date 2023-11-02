import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';
import categoryColors from "../constants/categoryColors";
import EditBookModal from '../components/EditBookModal';
import { AiFillEdit } from "react-icons/ai";
import NotesList from '../components/NoteList';
import Error from '../components/Error';
import '../styles/BookDetails.css'
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';

function BookDetails() {

  const [isLoading, setIsLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bookCategoryColor, setBookCategoryColor] = useState();
  const [bookStyle, setBookStyle] = useState();
  const { user } = useAuthContext();
  const params = useParams();
  const dispatchError = useDispatch();

  useEffect(() => {
    document.title = `Book details`;
  }, []);

  const fetchBook = useCallback(
    async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/book-details?bookId=${params.bookId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        setBookDetails(data.book);
        setBookCategoryColor(categoryColors[data.book.category] || '#FFFFFF');
        setBookStyle({
          background: `linear-gradient(${categoryColors[data.book.category]}, rgba(0, 0, 0, 0))`,
        });
        setIsLoading(false);
      } catch (error) {
        dispatchError(setError({ message: `Error fetching book data: ${error}` }))
        console.error('Error fetching book data: ', error);
        setIsLoading(false);
      }
    },
    [user, params.bookId, dispatchError],
  )

  useEffect(() => {
    if (user) {
      fetchBook();
    }
  }, [user, fetchBook]);

  const handleEditBook = () => {
    dispatchError(clearError());
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }


  return (
    <>
      <NavBar />
      {isLoading ? (
        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
      ) : (
        <>
          <Header title='Book Details' />
          <main className="book-details-container">
            {isOpen && <EditBookModal setIsOpen={setIsOpen} bookDetails={bookDetails} fetchBook={fetchBook} />}
            <Error />
            {bookDetails !== null ? (
              <div className='d-flex'>
                <div className="book-card" style={bookStyle}>
                  <AiFillEdit className="edit-book__icon" onClick={handleEditBook} />
                  <div className="book-thumbnail">
                    <img
                      src={bookDetails.thumbnail !== undefined ? bookDetails.thumbnail : 'https://storage.googleapis.com/book-buddy/images/image-not-available.png'}
                      alt={`Thumbnail for ${bookDetails.title}`}
                    />
                  </div>
                  <div className="book-details">
                    <h2 className="book-title">{bookDetails.title}</h2>
                    <p className="book-category book__category" style={{ backgroundColor: bookCategoryColor }}>{bookDetails.category}</p>
                    <p className="book-description">{bookDetails.description}</p>
                    {bookDetails.authors.length > 0 ?
                      <p className="book-authors">
                        Authors: {bookDetails.authors.map((author, index) => index === bookDetails.authors.length - 1 ? author : `${author}, `)}
                      </p>
                      : null}
                  </div>


                </div>
                <div className='notes__container'>

                  <NotesList bookDetails={bookDetails} />
                </div>
              </div>
            ) : (
              <h2>Nothing to see here</h2>
            )}
          </main>
        </>
      )}
    </>
  );
}

export default BookDetails;
