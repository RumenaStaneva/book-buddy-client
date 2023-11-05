import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from '../components/Header';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import Error from '../components/Error';
import { useDispatch, useSelector } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import '../styles/Profile.css'
import ProfilePicture from '../components/ProfilePicture';
import Diagram from '../components/Diagram';
import { fetchHasReadingTimeAnytime } from "../reducers/readingTimeForTodaySlice";
import AvatarEditorModal from '../components/AvatarEditorModal';

function Profile() {
    const [userData, setUserData] = useState({});
    const [isLoadingGlobal, setIsLoadingGlobal] = useState(true);
    const [bio, setBio] = useState('');
    const [hiddenBio, setHiddenBio] = useState(true);
    const [hiddenUsername, setHiddenUsername] = useState(true);
    const { user, dispatch } = useAuthContext();
    const [username, setUsername] = useState('');
    const dispatchRedux = useDispatch();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const { hasReadingTimeAnytime } = useSelector((state) => state.readingTimeForToday);
    const [isOpen, setIsOpen] = useState(false);


    const fetchUserData = useCallback(async () => {
        console.log('1');
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 401) {
                dispatchRedux(setError({ message: 'Unauthorized access' }));
                console.error('Unauthorized access');
                return;
            }

            const data = await response.json();
            setUserData(data.userProfile);
            setBio(data.userProfile.bio);
            setUsername(data.userProfile.username);
            setIsLoadingGlobal(false);
            dispatchRedux(clearError());
        } catch (error) {
            dispatchRedux(setError({ message: `Error fetching user data: ${error}` }));
            console.error('Error fetching user data: ', error);
            setIsLoadingGlobal(false);
        }
    }, [user, dispatchRedux]);

    useEffect(() => {
        console.log('2');
        document.title = `User's profile`;
        dispatchRedux(fetchHasReadingTimeAnytime(user));
        if (user && user.token) {
            fetchUserData();
        }
    }, [user, fetchUserData]);
    const handleUpdateInformation = async () => {
        console.log('3');

        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/update-profile-info`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ bio: bio, username: username }),
            });
            if (response.status === 401) {
                dispatchRedux(setError({ message: 'Unauthorized access' }));
                console.error('Unauthorized access');
                return;
            }
            setHiddenBio(true);
            setHiddenUsername(true);
            if (!response.ok) {
                const errorData = await response.json();
                dispatchRedux(setError({ message: `Error updating username: ${errorData.error}` }));
                return;
            } else {
                const localstorageUser = JSON.parse(localStorage.getItem('user'));
                localstorageUser.username = username;
                localStorage.setItem('user', JSON.stringify(localstorageUser));
                dispatch({ type: 'LOGIN', payload: localstorageUser });
                dispatchRedux(clearError());
            }
            fetchUserData();
        } catch (error) {
            dispatchRedux(setError({ message: `Error updating username: ${error}` }));
            console.error('Error updating username: ', error);
        }
    };

    const handleProfileClick = () => {
        console.log('5');

        setIsEditingProfile(!isEditingProfile);
    };

    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const [encodedImage, setEncodedImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);

    const handleImageUpload = async (e) => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = reader.result;
                setEncodedImage(imageDataUrl);
                setIsOpen(true);
                setIsLoading(false);
                document.body.style.overflow = 'hidden';
                if (uploadedImage.current) {
                    uploadedImage.current.file = file;
                    uploadedImage.current.src = imageDataUrl;
                }
            }
            reader.readAsDataURL(file);
        }
    }


    return (
        <>
            <NavBar />
            <main>
                {isLoadingGlobal ? null :
                    <Header title={`${user.username !== '' ? username : user.email.split('@')[0]}'s profile`} />
                }
                <div className="profile__container">
                    {isLoadingGlobal ? (
                        <div className='spinner__container'>
                            <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                        </div>
                    ) : (
                        <>
                            <Error />
                            <div className="profile__content">
                                <h1>User Profile</h1>
                                {!isEditingProfile && !isOpen && (
                                    <div className='profile__picture-container'>
                                        <Button className='change-picture__btn' onClick={() => imageUploader.current.click()}>

                                            <img width={150} height={150} src={user.profilePicture ? user.profilePicture : process.env.REACT_APP_DEFAULT_PROFILE_PICTURE} alt="Profile"
                                                className={`profile__profile-picture ${isEditingProfile ? 'editing' : ''}`}
                                            />
                                        </Button>
                                    </div>
                                )}

                                <>
                                    {isOpen && <AvatarEditorModal setIsOpen={setIsOpen} setEditor={setEditor} encodedImage={encodedImage} scale={scale} setScale={setScale} setEncodedImage={setEncodedImage} isLoading={isLoading} setIsLoading={setIsLoading} editor={editor} handleProfileClick={handleProfileClick} setIsEditingProfile={setIsEditingProfile} />}

                                    <form className="profile-form">
                                        <div className="image-uploader">
                                            <label htmlFor="profile-picture-uploader" className={`upload-label hidden`}>Click to add your image</label>
                                            <input
                                                type="file"
                                                name="profile-picture-uploader"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                ref={imageUploader}
                                                style={{
                                                    display: "none"
                                                }}
                                            />
                                        </div>
                                        {!encodedImage.length > 0 &&
                                            <div className="image-container" onClick={() => imageUploader.current.click()}>

                                            </div>

                                        }
                                    </form >
                                </>

                                <p className="profile__status">Profile Status: {!userData.isAdmin ? 'Regular' : 'Admin'}</p>

                                <div className="profile__field">
                                    <label>Email: </label>
                                    <div className="profile__info" id="email">{userData.email}</div>
                                </div>
                                <div className="profile__field">
                                    <label>Bio: </label>
                                    {hiddenBio && !bio ? <button className='cta-btn btn-sm' onClick={() => setHiddenBio(false)}>Add bio</button> : null}
                                    <div onClick={() => setHiddenBio(false)} className="profile__clickable" tabIndex="0">
                                        {!hiddenBio ? null : <span className="hidden">{bio}</span>}
                                    </div>
                                    <textarea
                                        rows="4"
                                        cols="50"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        {...(hiddenBio ? { hidden: true } : {})}
                                        className={`profile__textarea ${hiddenBio ? 'hidden' : ''}`}
                                        aria-labelledby="bio"
                                    />
                                </div>

                                <div className="profile__field">
                                    <label>Username: </label>
                                    <div onClick={() => setHiddenUsername(false)} className="profile__clickable" tabIndex="0">
                                        {!hiddenUsername ? null : <span className="hidden">{username}</span>}
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        {...(hiddenUsername ? { hidden: true } : {})}
                                        className={`profile__input ${hiddenUsername ? 'hidden' : ''}`}
                                        aria-labelledby="username"
                                    />
                                </div>

                                {(username !== userData.username || bio !== userData.bio) && (
                                    <Button onClick={handleUpdateInformation} className="update__button">
                                        Update Information
                                    </Button>
                                )}

                            </div>
                            {hasReadingTimeAnytime ?
                                <Diagram />
                                : null}
                        </>

                    )}
                </div>
            </main>

        </>


    )
}

export default Profile;