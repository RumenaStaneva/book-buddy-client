import "../styles/Modal.scss";
import { useState, useEffect, useRef, FormEvent } from "react";
import Dropdown from "./Dropdown";
import { useAuthContext } from "../hooks/useAuthContext";
import { setError, clearError } from "../reducers/errorSlice";
import BookCategories from "../constants/bookCategories";
import Button from "./Button";
import Modal from "./Dialog";
import Error from "./Error";
import Spinner from "react-spinner-material";
import { NavLink } from "react-router-dom";
import { findExistingCategory } from "../functions";
import { Book } from "./BookList";
import { useAppDispatch } from "../hooks/basicHooks";

type AddBookModalProps = {
  setIsOpen: (isOpen: boolean) => void;
  bookDetails: Book | null;
  onBookAdded: (title: string) => void;
  previousElement: Element | null;
};

type BookToAdd = {
  bookApiId: string;
  userEmail: string;
  title: string;
  authors: Array<string>;
  description: string;
  publisher: string;
  thumbnail: string;
  category: string;
  pageCount: number;
  notes: Array<string>;
  progress: number;
  shelf: number;
};

const initialBookToAddState: BookToAdd = {
  bookApiId: "",
  userEmail: "",
  title: "",
  authors: [],
  description: "",
  publisher: "",
  thumbnail: "",
  category: "",
  pageCount: 0,
  notes: [],
  progress: 0,
  shelf: 0,
};

type ShelfOptions = {
  value: number;
  label: string;
};

const AddBookModal = ({
  setIsOpen,
  bookDetails,
  onBookAdded,
  previousElement,
}: AddBookModalProps) => {
  const [shelf, setShelf] = useState<number>(0);
  const [category, setCategory] = useState(
    bookDetails!.categories
      ? findExistingCategory(bookDetails!.categories[0])
      : ""
  );
  // console.log(bookDetails);
  const [bookToAdd, setBookToAdd] = useState<BookToAdd>(initialBookToAddState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedDescription, setUpdatedDescription] = useState<string>(
    bookDetails!.description ? bookDetails!.description : ""
  );
  const [updatedThumbnail, setUpdatedThumbnail] = useState(
    bookDetails!.thumbnail
  );
  const [updatedPageCount, setUpdatedPageCount] = useState<number>(
    bookDetails!.pageCount ? bookDetails!.pageCount : 0
  );
  const [loginVisivble, setLoginVisible] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const { user } = useAuthContext();
  const shelfOptions: Array<ShelfOptions> = [
    { value: 0, label: "Want to read" },
    { value: 1, label: "Currently reading" },
    { value: 2, label: "Read" },
  ];
  const fileInputRef = useRef<HTMLLabelElement>(null);
  const dispatchError = useAppDispatch();

  const handleOptionSelect = (selectedOption: string | null) => {
    const selectedValue = shelfOptions.find(
      (option) => option.label === selectedOption
    )?.value;
    if (selectedValue !== undefined) {
      setShelf(selectedValue);
    }
  };

  // console.log(findExistingCategory(category));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("FORM SUBMITTED");
    e.preventDefault();
    setIsLoading(true);
    dispatchError(clearError());
    if (!user) {
      dispatchError(
        setError({ message: "You have to be logged in to add books!" })
      );
      setLoginVisible(true);
      setIsLoading(false);
      return;
    }
    const { bookApiId, title, authors, publisher } = bookDetails!;
    setFormSubmitted(true);
    console.log("bookToAdd", bookToAdd);
    if (updatedThumbnail && category && shelf) {
      setBookToAdd({
        bookApiId: bookApiId,
        userEmail: user.email,
        title: title,
        authors: authors,
        description: updatedDescription,
        publisher: publisher,
        thumbnail: updatedThumbnail,
        category: category,
        pageCount: updatedPageCount,
        notes: [],
        progress: 0,
        shelf: shelf,
      });
    }
  };

  useEffect(() => {
    // console.log("useeffectttttttttttttt");
    // console.log(formSubmitted);

    if (formSubmitted) {
      // console.log("hhhahahahahhahaha");

      const addBookToShelf = async () => {
        try {
          if (bookToAdd !== null && category != null) {
            const formData = new FormData();
            formData.append("bookApiId", bookDetails!.bookApiId);
            formData.append("userEmail", user.email);
            formData.append("title", bookDetails!.title);
            formData.append("authors", bookDetails!.authors.join(", "));
            formData.append("description", updatedDescription);
            formData.append("publisher", bookDetails!.publisher);
            formData.append("category", category);
            formData.append("pageCount", updatedPageCount.toString());
            formData.append("progress", "0");
            formData.append("shelf", shelf!.toString());

            if (updatedThumbnail) {
              formData.append("thumbnail", updatedThumbnail);
            }
            console.log("formData", formData);

            const response = await fetch(
              `${process.env.REACT_APP_LOCAL_HOST}/books/add-to-shelf`,
              {
                method: "POST",
                body: formData,
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            if (!response.ok) {
              const data = await response.json();
              dispatchError(setError({ message: data.error }));
              setIsLoading(false);
              setFormSubmitted(false);
              throw new window.Error(data.error);
            }

            const data = await response.json();
            console.log(data);

            dispatchError(clearError());
            setIsOpen(false);
            document.body.style.overflow = "visible";
            (previousElement as HTMLElement)?.focus();
            onBookAdded(data.book.title);
            setIsLoading(false);
          }
        } catch (error: any) {
          console.log(error);
          dispatchError(setError({ message: error.message }));
          setIsLoading(false);
        }
      };

      addBookToShelf();

      setBookToAdd(initialBookToAddState);
    }
  }, [
    bookToAdd,
    user,
    onBookAdded,
    setIsOpen,
    dispatchError,
    //bookDetails!.authors,
    // bookDetails!.bookApiId,
    // bookDetails!.publisher,
    // bookDetails!.title,
    category,
    shelf,
    updatedDescription,
    updatedPageCount,
    updatedThumbnail,
    previousElement,
    bookDetails,
    formSubmitted,
  ]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target) {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Calculate new dimensions to resize the image (250x250)
            const maxWidth = 250;
            const maxHeight = 250;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            if (ctx) {
              // Draw the resized image on the canvas
              ctx.drawImage(img, 0, 0, width, height);

              // Convert canvas content to base64 data URL
              const dataUrl = canvas.toDataURL("image/jpeg"); // Change format if necessary

              setUpdatedThumbnail(dataUrl);

              // Create a Blob from data URL and append it to FormData
              const blobBin = atob(dataUrl.split(",")[1]);
              const array = [];
              for (let i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
              }
              const resizedImageBlob = new Blob([new Uint8Array(array)], {
                type: "image/jpeg",
              }); // Change type if necessary

              const formData = new FormData();
              formData.append("thumbnail", resizedImageBlob);
            }
          };
          const result = event.target?.result;
          if (result !== null) {
            img.src = result as string;
          }
          // img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
        fileInputRef.current?.focus();
      }
    }
  };

  function findSelectedOption(): string | null {
    if (shelf !== null && shelfOptions) {
      const foundOption = shelfOptions.find(
        (option) => option.value === shelf
      )?.label;
      if (foundOption) {
        return foundOption;
      }
    }
    return null;
  }

  return (
    <Modal
      title={bookDetails!.title}
      onClose={() => setIsOpen(false)}
      subtitle={`written by: ${
        bookDetails!.authors
          ? bookDetails!.authors.join(", ")
          : "No author/s listed"
      }`}
      setIsOpen={setIsOpen}
      previousElement={previousElement ? previousElement : document.body}
      content={
        <>
          <form onSubmit={handleSubmit} className="add-book__form">
            <>
              <div className={`add-book-form__container `}>
                <div className="modal__section-image-container">
                  <div className="modal__section">
                    <label htmlFor="thumbnail" className="d-none">
                      Thumbnail
                    </label>
                    <img
                      src={
                        updatedThumbnail !== null
                          ? updatedThumbnail
                          : "https://storage.googleapis.com/book-buddy/images/image-not-available.png"
                      }
                      alt={bookDetails!.title}
                      width={300}
                    />
                  </div>
                </div>
                <div className="modal__section-content-container">
                  <div className="modal__section modal__section-left-align">
                    <label htmlFor="description">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      cols={10}
                      rows={5}
                      value={updatedDescription}
                      onChange={(e) => setUpdatedDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="modal__section book-pages-section modal__section-left-align">
                    <label htmlFor="pageCount">Book Pages</label>
                    <input
                      type="number"
                      id="pageCount"
                      value={updatedPageCount}
                      onChange={(e) =>
                        setUpdatedPageCount(parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="modal__section upload-image-section">
                    <span>Change book thumbnail</span>
                    <label
                      htmlFor="bookImage"
                      className="cta-btn upload-btn"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          const bookImageInput =
                            document.getElementById("bookImage");
                          if (bookImageInput) {
                            bookImageInput.click();
                          }
                        }
                      }}
                      ref={fileInputRef}
                    >
                      Book image
                    </label>
                    <input
                      id="bookImage"
                      name="bookImage"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                    />
                  </div>
                  <div className="modal__section modal__section-left-align">
                    <label htmlFor="dropdown-shelf">Choose Book Status</label>
                    <Dropdown
                      id={"dropdown-shelf"}
                      options={shelfOptions.map((option) => option.label)}
                      onSelect={handleOptionSelect}
                      selectedOption={findSelectedOption()}
                    />
                  </div>
                  <div className="modal__section modal__section-left-align">
                    <label htmlFor="dropdown-shelf">Choose Book Category</label>
                    <Dropdown
                      id={"dropdown-category"}
                      options={Object.values(BookCategories)}
                      onSelect={(selectedCategory: string) =>
                        setCategory(selectedCategory)
                      }
                      selectedOption={category !== null ? category : null}
                    />
                  </div>
                </div>
              </div>
              <Error />
              {loginVisivble ? (
                <NavLink to="/users/login">
                  <Button className="cta-button">
                    {isLoading ? (
                      <Spinner
                        radius={10}
                        color={"#fff"}
                        stroke={2}
                        visible={true}
                      />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </NavLink>
              ) : (
                <Button
                  type="submit"
                  className="cta-button"
                  aria-label="Add Book"
                >
                  {isLoading ? (
                    <Spinner
                      radius={10}
                      color={"#fff"}
                      stroke={2}
                      visible={true}
                    />
                  ) : (
                    "Add Book"
                  )}
                </Button>
              )}
            </>
          </form>
        </>
      }
    />
  );
};
export default AddBookModal;
