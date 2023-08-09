import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';


function Profile() {
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const { user } = useAuthContext();


    const fetchUserData = async () => {
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
    };

    useEffect(() => {
        if (user && user.token) {
            fetchUserData();
        }
    }, [user]);

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
            fetchUserData();
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    return (
        <>
            <NavBar />
            {isLoading ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : (
                <>
                    <p>User Profile</p>
                    <p>Profile status:
                        {!userData.isAdmin ? 'regular' : 'admin'}
                    </p>

                    <p>Email: {userData.email}</p>
                    <p>Bio: {bio}</p>
                    <textarea
                        rows="4"
                        cols="50"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <p>Username: {username}</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleUpdateInformation}>Update information</button>
                </>
            )}
        </>
    )
}

export default Profile;