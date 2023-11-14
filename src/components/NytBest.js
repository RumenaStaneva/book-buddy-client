
import { useState, useEffect, useCallback } from 'react';
import { REACT_APP_LOCAL_HOST } from '../functions';
import NyBestBook from './NyBestBook';

function NytBest() {

    const [bestSellers, setBestSellers] = useState([]);

    const fetchBestSellers = useCallback(async () => {
        try {
            const url = `${REACT_APP_LOCAL_HOST}/api/popular-books`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setBestSellers((prevBestSellers) => [...prevBestSellers, ...data.results.lists]);

        } catch (error) {
            console.log(error);
        }
    }, [setBestSellers]);

    useEffect(() => {
        fetchBestSellers();
    }, [fetchBestSellers]);
    return (
        <div>
            {bestSellers && bestSellers.map(shelf => {
                return (
                    <div key={bestSellers.list_id} className='d-flex'>
                        <div>{shelf.display_name}</div>
                        <NyBestBook books={shelf.books} />
                    </div>
                )
            })}
        </div >
    )
}

export default NytBest;