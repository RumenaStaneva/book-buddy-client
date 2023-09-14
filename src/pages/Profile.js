import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Header from '../components/Header';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import '../styles/Profile.css'


function Profile() {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [hiddenBio, setHiddenBio] = useState(true);
    const [hiddenUsername, setHiddenUsername] = useState(true);
    const { user, dispatch } = useAuthContext();
    const [username, setUsername] = useState('');

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 401) {
                console.error('Unauthorized access');
                return;
            }

            const data = await response.json();
            setUserData(data.userProfile);
            setBio(data.userProfile.bio);
            setUsername(data.userProfile.username)
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.token) {
            fetchUserData();
        }
    }, [user, fetchUserData]);

    const handleUpdateInformation = async () => {
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
                console.error('Unauthorized access');
                return;
            }
            setHiddenBio(true);
            setHiddenUsername(true);
            const localstorageUser = JSON.parse(localStorage.getItem('user'));
            localstorageUser.username = username;
            localStorage.setItem('user', JSON.stringify(localstorageUser));
            dispatch({ type: 'LOGIN', payload: localstorageUser });
            fetchUserData();
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    useEffect(() => {
        document.title = `User's profile`;
    }, []);

    return (
        <>
            <NavBar />
            <div className="profile__container">
                {isLoading ? null :
                    <Header title={`${user.username !== '' ? username : user.email.split('@')[0]}'s profile`} />
                }
                {isLoading ? (
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                ) : (
                    <div className="profile__content">
                        <h1>User Profile</h1>
                        <p className="profile__status">Profile Status: {!userData.isAdmin ? 'Regular' : 'Admin'}</p>

                        <div className="profile__field">
                            <label>Email: </label>
                            <div className="profile__info" id="email">{userData.email}</div>
                        </div>

                        <div className="profile__field">
                            <label>Bio: </label>
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
                )}
            </div>
        </>


    )
}

export default Profile;