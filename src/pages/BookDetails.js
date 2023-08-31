import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';
import categoryColors from "../constants/categoryColors";
import EditBookModal from '../components/EditBookModal';
import { AiFillEdit } from "react-icons/ai";
import InfiniteScroll from 'react-infinite-scroll-component';
import '../styles/BookDetails.css'

function BookDetails() {

  const [isLoading, setIsLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bookCategoryColor, setBookCategoryColor] = useState();
  const [bookStyle, setBookStyle] = useState();
  const { user } = useAuthContext();
  const [notesIsVisible, setNotesIsVisible] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [hasMoreNotes, setHasMoreNotes] = useState(true);
  const params = useParams();

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
        // console.log(data.book);
        setBookDetails(data.book);
        setBookCategoryColor(categoryColors[data.book.category] || '#FFFFFF');
        setBookStyle({
          background: `linear-gradient(${categoryColors[data.book.category]}, rgba(0, 0, 0, 0))`,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching book data:', error);
        setIsLoading(false);
      }
    },
    [user, params.bookId],
  )

  useEffect(() => {
    if (user) {
      fetchBook();
    }
  }, [user, fetchBook]);

  const handleEditBook = () => {
    setIsOpen(true);
  }
  const handleAddNote = async (bookId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/add-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ noteText: note, bookId }),
      })
      await response.json();
      setNotesIsVisible(false);
      fetchMoreNotes();
      setHasMoreNotes(true);
    } catch (error) {
      console.log('Error creating note: ', error);
    }
  }

  const fetchNotes = useCallback(
    async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/book-notes?bookId=${params.bookId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        setNotes(data.notes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notes data:', error);
        setIsLoading(false);
      }
    },
    [user, params.bookId],
  );

  const fetchMoreNotes = useCallback(
    async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/book-notes?bookId=${params.bookId}&offset=${notes.length}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        if (data.notes.length > 0) {
          setNotes([...notes, ...data.notes]);
        } else {
          setHasMoreNotes(false);
        }
      } catch (error) {
        console.error('Error fetching more notes data:', error);
      }
    },
    [user, params.bookId, notes],
  );


  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleScroll = e => {
    const element = e.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (atBottom && hasMoreNotes) {
      fetchMoreNotes();
    }
  };


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
            {bookDetails !== null ? (
              <div className='d-flex'>
                <div className="book-card" style={bookStyle}>
                  <AiFillEdit className="edit-book__icon" onClick={handleEditBook} />
                  <div className="book-thumbnail">
                    <img
                      src={bookDetails.thumbnail}
                      alt={`Thumbnail for ${bookDetails.title}`}
                    />
                  </div>
                  <div className="book-details">
                    <h2 className="book-title">{bookDetails.title}</h2>
                    <p className="book-category book__category" style={{ backgroundColor: bookCategoryColor }}>{bookDetails.category}</p>
                    <p className="book-description">{bookDetails.description}</p>
                    <p className="book-authors">
                      Authors: {bookDetails.authors.map((author, index) => index === bookDetails.authors.length - 1 ? author : `${author}, `)}
                    </p>
                  </div>


                </div>

                <div>
                  {notesIsVisible ? null :
                    <button onClick={() => setNotesIsVisible(true)}>Create note for this book</button>
                  }
                  {notesIsVisible ?
                    <div>
                      <label htmlFor="addNote">Create note for this book: </label>
                      <textarea name="addNote" id="addNote" cols="100" rows="10" onChange={(e) => setNote(e.target.value)}></textarea>
                      <button className='cta-btn' onClick={() => handleAddNote(bookDetails._id)}>Add note</button>
                    </div>
                    : null}
                  <div>
                    <p>Book Notes</p>
                    <br />

                    <div className="notes-container"
                      onScroll={handleScroll}>
                      <InfiniteScroll
                        dataLength={notes.length}
                        next={fetchMoreNotes}
                        hasMore={hasMoreNotes}
                        loader={<p>...</p>}
                        endMessage={<p>No more data to load.</p>}
                      >
                        <ul>
                          {notes.map(note => (
                            <li key={note._id}>{note.noteText}</li>
                          ))}
                        </ul>
                      </InfiniteScroll>
                    </div>
                  </div>
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
