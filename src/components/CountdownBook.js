import '../styles/Library.css'
import '../styles/LibraryBook.css'

function CountdownBook({ book }) {

    return (
        <>
            <div className='books__container currently-reading__container'>
                {
                    <div className='book'>
                        <div
                            className='book__details'
                            onClick={event => {
                                event.stopPropagation();
                                event.preventDefault();
                            }}
                        >
                            <div className='title-author__container'>
                                <h3 className='book__title book-font__outline'>
                                    {book.title}
                                </h3>

                                {book.authors.length > 0 ?

                                    <p className='book__authors'> By: {' '}
                                        {book.authors?.join(', ')}
                                    </p> : null}
                            </div>
                            <img
                                src={
                                    book.thumbnail === undefined
                                        ? require('../images/image-not-available.png')
                                        : `${book.thumbnail}`
                                } alt={`${book.title}`}
                                className='book__image'
                            />
                        </div>
                    </div>
                }
            </div >
        </>
    )

}

export default CountdownBook;