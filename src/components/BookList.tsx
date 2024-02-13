import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "../styles/books-list.scss";
import AddBookModal from "./AddBookModal";
import { useDispatch } from "react-redux";
import { clearError } from "../reducers/errorSlice";
// import Spinner from 'react-spinner-material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Book = {
  bookApiId: string;
  title: string;
  authors: Array<string>;
  description: string;
  publisher: string;
  thumbnail: string | null;
  categories: Array<string>;
  pageCount: number;
};

type BookListProps = {
  books: Book[];
};

function BookList({ books }: BookListProps) {
  // console.log(books);

  const [bookToAdd, setBookToAdd] = useState<Book | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatchError = useDispatch();
  const [previousElement, setPreviousElement] = useState<Element | null>(null);

  const handleAddToShelf = (book: Book) => {
    let thumbnail = book.thumbnail;
    if (!thumbnail) {
      thumbnail = null;
    }
    if (book) {
      setBookToAdd(book);
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleBookAdded = (title: string) => {
    toast.success(`${title} added successfully`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        fontSize: "14px",
      },
    });
  };
  // console.log('previousElement', previousElement);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    // loading ?
    //     <div className='spinner__container'>
    //         <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
    //     </div>
    //     :
    <>
      {isOpen && (
        <AddBookModal
          previousElement={previousElement}
          setIsOpen={setIsOpen}
          bookDetails={bookToAdd}
          onBookAdded={handleBookAdded}
        />
      )}
      <ToastContainer />

      <div className="books__container books-list__container">
        {books.map((book) => (
          <div className="book__container" key={book.bookApiId}>
            <Card sx={{ maxWidth: 345 }} className="book">
              <CardActionArea
                className="book__button"
                component="button"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setIsOpen(true);
                  document.body.style.overflow = "hidden";
                  handleAddToShelf(book);
                  dispatchError(clearError());
                  setPreviousElement(document.activeElement || document.body);
                }}
              >
                <CardMedia
                  component="img"
                  src={
                    book.thumbnail === null
                      ? "https://storage.googleapis.com/book-buddy/images/image-not-available.png"
                      : `${book.thumbnail}`
                  }
                  alt={`${book.title}`}
                  className="book__image"
                />
                <CardContent>
                  <p className="book__title">{book.title}</p>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    className="book__authors"
                  >
                    {book.authors?.join(", ")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="book__description"
                  >
                    {book.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

export default BookList;
