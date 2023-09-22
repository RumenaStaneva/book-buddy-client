import { useState, useEffect, useCallback } from 'react';
import { AiFillEdit, AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { MdOutlineCancel } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from 'react-spinner-material';
import Button from './Button';
import Error from './Error';


const NotesList = ({ bookDetails }) => {
    const { user } = useAuthContext();
    const bookId = bookDetails._id;

    const [editedNoteId, setEditedNoteId] = useState(null);

    const [editNoteVisible, setEditNoteVisible] = useState(false);
    const [notesIsVisible, setNotesIsVisible] = useState(false);
    const [editedNoteText, setEditedNoteText] = useState('');
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);
    const [hasMoreNotes, setHasMoreNotes] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddNote = async () => {
        if (note.trim().length === 0) {
            setErrorMessage('Note can not be empty');
            return;
        }

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
            setErrorMessage('');
            setNotesIsVisible(false);
            if (notes.length < 10) {
                fetchNotes();
                setHasMoreNotes(false);
            } else {
                fetchMoreNotes();
                setHasMoreNotes(true);
            }
        } catch (error) {
            setErrorMessage('Error creating note: ', error);
        }
    }

    const fetchNotes = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/book-notes?bookId=${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
                if (data.notes.length > 0) {
                    setNotes(data.notes);
                } else {

                }
            } catch (error) {
                setErrorMessage('Error fetching notes data:', error);
                console.error('Error fetching notes data:', error);
            }
        },
        [user, bookId],
    );

    const fetchMoreNotes = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/book-notes?bookId=${bookId}&offset=${notes.length}`, {
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
                setErrorMessage('Error fetching more notes data:', error);
                console.error('Error fetching more notes data:', error);
            }
        },
        [user, bookId, notes],
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

    const handleEditNote = (noteId, noteText) => {
        setEditNoteVisible(true);
        setEditedNoteText(noteText);
        setEditedNoteId(noteId);
    }

    const handleSaveEdit = async (note) => {
        try {
            const noteId = note._id;
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/update-note?noteId=${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ note, editedNoteText }),
            });

            const data = await response.json();
            const editedNote = data.editedNote;
            setEditNoteVisible(false);
            handleCancelEdit();
            notes.map(note => note._id === editedNote._id ? note.noteText = editedNote.noteText : note);
        } catch (error) {
            setErrorMessage('Error updating note:', error);
            console.error('Error updating note:', error);
        }
    }

    const handleCancelEdit = () => {
        setEditNoteVisible(false);
        setEditedNoteId(null);
        setEditedNoteText('');
    }

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/delete-note?noteId=${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });

            const data = await response.json();
            const deletedNoteId = data.deletedNote._id;
            const updatedNotes = notes.filter(note => note._id !== deletedNoteId);
            setNotes(updatedNotes);
        } catch (error) {
            setErrorMessage(error.error);
        }
    }

    return (
        <>
            {notesIsVisible ? null :
                <Button className='cta-btn' onClick={() => setNotesIsVisible(true)}>Create note for this book</Button>
            }
            {notesIsVisible ?
                <div className='notes__add-form'>
                    <div className='notes__inner'>
                        <label className='notes__add-label' htmlFor="addNote">Create note for this book: </label>
                        <MdOutlineCancel onClick={() => setNotesIsVisible(false)} />
                    </div>
                    {errorMessage.length > 0 ? (
                        <Error message={errorMessage} onClose={() => setErrorMessage('')} />
                    ) : null}
                    <textarea className='notes__add-textarea' name="addNote" id="addNote" cols="100" rows="10" onChange={(e) => setNote(e.target.value)}></textarea>
                    <Button className='cta-btn' onClick={() => handleAddNote()}>Add note</Button>
                </div>
                : null}
            <div>
                <p className='notes__header'>Book Notes</p>
                {notes.length > 0 ?
                    <div className="notes__list-container"
                        onScroll={handleScroll}>
                        <div className='notes__list'>
                            {notes.map((note) =>
                                (editNoteVisible && editedNoteId === note._id) ? (
                                    <div className='notes__item' key={note._id}>
                                        <textarea className='edit-note-textarea' value={editedNoteText} onChange={(e) => setEditedNoteText(e.target.value)} ></textarea>
                                        <div className='note__actions'>
                                            <AiOutlineSave className='save-edit' onClick={() => handleSaveEdit(note)} />

                                            <MdOutlineCancel className='cancel-edit' onClick={() => handleCancelEdit()} />

                                        </div>
                                    </div>
                                ) : (
                                    <div className='notes__item' key={note._id}>
                                        {note.noteText}
                                        <div className='note__actions'>
                                            <AiFillEdit className='edit-note' onClick={() => handleEditNote(note._id, note.noteText)} />
                                            <AiOutlineDelete className='delete-note' onClick={() => handleDeleteNote(note._id)} />
                                        </div>
                                    </div>
                                )
                            )}
                            <InfiniteScroll
                                dataLength={notes.length}
                                next={fetchMoreNotes}
                                hasMore={hasMoreNotes}
                                height={100}
                                loader={<Spinner />}
                                endMessage={<p>No more notes</p>}
                            ></InfiniteScroll>
                        </div>
                    </div>
                    : <div className="notes__list-container">
                        <p>No notes yet for this book</p>
                    </div>
                }
            </div>
        </>
    );
};

export default NotesList;
