import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import Spinner from 'react-spinner-material';


function ProfilePicture() {
    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user, dispatch } = useAuthContext();
    const dispatchError = useDispatch();

    const handleImageUpload = async (e) => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            const { current } = uploadedImage;
            setImageUploaded(true);
            current.file = file;
            reader.onload = (e) => {
                const imageDataUrl = reader.result;
                // console.log(imageDataUrl);
                setEncodedImage(imageDataUrl);
                current.src = e.target.result;
            }
            reader.readAsDataURL(file);


        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        console.log(encodedImage);
        const formData = new FormData();
        formData.append('profilePicture', encodedImage);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/upload-profile-picture`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });

            if (response.status === 401) {
                dispatchError(setError({ message: 'Unauthorized access' }));
                console.error('Unauthorized access');
                return;
            }

            const responseData = await response.json();
            console.log(responseData);
            if (response.ok) {
                const localstorageUser = JSON.parse(localStorage.getItem('user'));
                localstorageUser.profilePicture = responseData.user.profilePicture;
                localStorage.setItem('user', JSON.stringify(localstorageUser));
                dispatch({ type: 'LOGIN', payload: localstorageUser });
                dispatchError(clearError());

            } else {
                // Handle error scenarios
                console.error('Error uploading profile picture:', responseData.error);
                dispatchError(setError({ message: `Error uploading profile picture: ${responseData.error}` }));
            }
        } catch (error) {
            console.error('Network error occurred:', error);
            dispatchError(setError({ message: `Network error occurred: ${error.message}` }));
        }
        setIsLoading(false);
    }

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 401) {
                dispatchError(setError({ message: 'Unauthorized access' }));
                console.error('Unauthorized access');
                return;
            }

            const data = await response.json();
            setProfileImage(data.userProfile.profilePicture)
            setIsLoading(false);
            dispatchError(clearError());
        } catch (error) {
            dispatchError(setError({ message: `Error fetching user data: ${error}` }));
            console.error('Error fetching user data: ', error);
            setIsLoading(false);
        }
    }, [user, dispatchError]);

    useEffect(() => {
        if (user && user.token) {
            fetchUserData();
        }
    }, [user, fetchUserData]);

    return (
        <>
            {isLoading ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : (
                <form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <div style={{ position: 'relative', width: '100%' }}>
                        <label htmlFor="profile-picture-uploader" style={{ position: 'absolute', left: 0, right: 0, display: imageUploaded ? 'none' : '' }}>Click to add your image</label>
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
                    <div
                        style={{
                            height: "400px",
                            width: "400px",
                            border: "2px dashed black"
                        }}
                        onClick={() => imageUploader.current.click()}
                    >

                        <img
                            ref={uploadedImage}
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>
                    <button type="submit" onClick={handleSubmit}>Add picture</button>
                </form >
            )}
        </>
    )
}

export default ProfilePicture;