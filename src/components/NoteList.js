import { useState, useEffect, useCallback } from 'react';
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from 'react-spinner-material';




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



    const handleAddNote = async () => {
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
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/book-notes?bookId=${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
                setNotes(data.notes);
            } catch (error) {
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
            console.log(data);
            console.log(editedNote);
            setEditNoteVisible(false);
            handleCancelEdit();
            notes.map(note => note._id === editedNote._id ? note.noteText = editedNote.noteText : note);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    }

    const handleCancelEdit = () => {
        setEditNoteVisible(false);
        setEditedNoteId(null);
        setEditedNoteText('');
    }


    return (
        <>
            {notesIsVisible ? null :
                <button className='notes__create-button' onClick={() => setNotesIsVisible(true)}>Create note for this book</button>
            }
            {notesIsVisible ?
                <div className='notes__add-form'>
                    <label className='notes__add-label' htmlFor="addNote">Create note for this book: </label>
                    <textarea className='notes__add-textarea' name="addNote" id="addNote" cols="100" rows="10" onChange={(e) => setNote(e.target.value)}></textarea>
                    <button className='cta-btn' onClick={() => handleAddNote()}>Add note</button>
                </div>
                : null}
            <div>
                <p className='notes__header'>Book Notes</p>

                <div className="notes__list-container"
                    onScroll={handleScroll}>
                    <div className='notes__list'>
                        {notes.map((note) =>
                            (editNoteVisible && editedNoteId === note._id) ? (
                                <div className='notes__item' key={note._id}>
                                    <textarea className='edit-note-input' value={editedNoteText} onChange={(e) => setEditedNoteText(e.target.value)} />
                                    <div className='note__actions'>
                                        <button className='save-edit' onClick={() => handleSaveEdit(note)}>
                                            Save
                                        </button>
                                        <button className='cancel-edit' onClick={() => handleCancelEdit()}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className='notes__item' key={note._id}>
                                    {note.noteText}
                                    <div className='note__actions'>
                                        <AiFillEdit className='edit-note' onClick={() => handleEditNote(note._id, note.noteText)} />
                                        <AiOutlineDelete className='delete-note' />
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
            </div>
        </>
    );
};

export default NotesList;
