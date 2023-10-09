import { useEffect, useRef, useState, useCallback } from "react";
import AvatarEditor from 'react-avatar-editor';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import Spinner from 'react-spinner-material';
import '../styles/Profile.css'

function ProfilePicture({ handleProfileClick }) {
    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user, dispatch } = useAuthContext();
    const dispatchError = useDispatch();
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);

    const handleImageUpload = async (e) => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = reader.result;
                setEncodedImage(imageDataUrl);
                if (uploadedImage.current) {
                    uploadedImage.current.file = file;
                    uploadedImage.current.src = imageDataUrl;
                }
            }
            reader.readAsDataURL(file);
            setImageUploaded(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (editor) {
            const canvas = editor.getImageScaledToCanvas();
            const dataUrl = canvas.toDataURL();
            const formData = new FormData();

            formData.append('profilePicture', dataUrl);

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
                if (response.ok) {
                    const localstorageUser = JSON.parse(localStorage.getItem('user'));
                    localstorageUser.profilePicture = responseData.user.profilePicture;
                    localStorage.setItem('user', JSON.stringify(localstorageUser));
                    dispatch({ type: 'LOGIN', payload: localstorageUser });
                    dispatchError(clearError());
                    setEncodedImage('');
                    handleProfileClick();
                    setScale(1);
                    setEditor(null);
                } else {
                    console.error('Error uploading profile picture:', responseData.error);
                    dispatchError(setError({ message: `Error uploading profile picture: ${responseData.error}` }));
                }
            } catch (error) {
                console.error('Network error occurred:', error);
                dispatchError(setError({ message: `Network error occurred: ${error.message}` }));
            }
            setIsLoading(false);
        } else {
            console.error('Editor instance is null');
            setIsLoading(false);
        }
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

            await response.json();
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
                <form className="profile-form">
                    <div className="image-uploader">
                        <label htmlFor="profile-picture-uploader" className={`upload-label ${imageUploaded ? 'hidden' : ''}`}>Click to add your image</label>
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
                    {!encodedImage.length > 0 ?
                        <div className="image-container" onClick={() => imageUploader.current.click()}>

                        </div>
                        :
                        encodedImage.length > 0 && (
                            <div className="editor-container">
                                <AvatarEditor
                                    ref={(editor) => setEditor(editor)}
                                    image={encodedImage}
                                    width={250}
                                    height={250}
                                    border={50}
                                    borderRadius={500}
                                    color={[255, 255, 255, 0.6]}
                                    scale={scale}
                                />
                                <div className="zoom-control">
                                    <label>Zoom:</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="2"
                                        step="0.01"
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                    />
                                </div>
                                <button className="update__button" onClick={handleSubmit}>Add picture</button>
                            </div>
                        )}
                </form >
            )
            }
        </>
    )
}

export default ProfilePicture;