import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import Spinner from 'react-spinner-material';
import '../styles/Profile.css'
import AvatarEditorModal from "./AvatarEditorModal";

function ProfilePicture({ handleProfileClick }) {
    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthContext();
    const dispatchError = useDispatch();
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);

    const handleImageUpload = async (e) => {
        console.log('handleImageUpload');
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
            {encodedImage.length > 0 && <AvatarEditorModal setEditor={setEditor} encodedImage={encodedImage} scale={scale} setScale={setScale} setEncodedImage={setEncodedImage} isLoading={isLoading} setIsLoading={setIsLoading} editor={editor} handleProfileClick={handleProfileClick} />}
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
                    {!encodedImage.length > 0 &&
                        <div className="image-container" onClick={() => imageUploader.current.click()}>

                        </div>

                    }
                </form >
            )
            }
        </>
    )
}

export default ProfilePicture;