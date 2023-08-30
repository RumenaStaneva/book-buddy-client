import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';


function BookNotes() {
    const [isLoading, setIsLoading] = useState(true);
    const [notes, setNotes] = useState([]);

    const params = useParams();
    const { user } = useAuthContext();

    console.log(params.bookId);

    const fetchNotes = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/notes/book-notes?bookId=${params.bookId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
                console.log(data.notes);
                setNotes(data.notes);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching notes data:', error);
                setIsLoading(false);
            }
        },
        [user, params.bookId],
    )

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user, fetchNotes]);

    return (
        <>
            <NavBar />
            <main>
                {isLoading ? (
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                ) : (
                    <div>
                        <p>Book Notes</p>
                        <br />
                        <div>
                            {notes && notes.length > 0 ?
                                notes.map(note => (
                                    <div key={note._id}>
                                        <p>{note.noteText}</p>
                                        <br />
                                    </div>
                                ))
                                : null
                            }
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}

export default BookNotes;