import { useEffect, useRef } from 'react';
import { REACT_APP_LOCAL_HOST } from '../functions';

function PlaylistReading() {
    // const [showIframe, setShowIframe] = useState(true);
    // const [accessToken, setAccessToken] = useState(null);
    const iframeRef = useRef(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${REACT_APP_LOCAL_HOST}/spotify/access-token`, {
                    method: 'POST'
                });
                if (response.ok) {
                    // const data = 
                    await response.json();
                    // setAccessToken(data.accessToken);
                } else {
                    console.error('Error fetching access token:', response.status);
                }
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     const handleClickOutsideIframe = (event) => {
    //         if (iframeRef.current && !iframeRef.current.contains(event.target)) {
    //             if (!(event.target instanceof SVGElement && event.target.closest('button'))) {
    //                 setShowIframe(false);
    //             }
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutsideIframe);

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutsideIframe);
    //     };
    // }, []);

    // const toggleIframe = () => {
    //     setShowIframe(!showIframe);
    // };

    return (
        // <div className={`spotify-player__container ${showIframe ? 'open' : null}`}>
        <div className={`spotify-player__container`}>
            {/* <Button onClick={toggleIframe}>
                <FaSpotify />
            </Button> */}
            {/* {showIframe && ( */}
            <div style={{ marginBottom: 20 }}>
                <iframe
                    ref={iframeRef}
                    className='spotify-iframe'
                    id='spotify-iframe'
                    title="Spotify Playlist"
                    style={{ borderRadius: 12 }}
                    src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="encrypted-media"
                ></iframe>
            </div>
            {/* )} */}
        </div>
    );
}

export default PlaylistReading;
