import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError } from '../reducers/errorSlice';

function ProfilePicture() {
    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const [imageUploaded, setImageUploaded] = useState(false);
    const [encodedImage, setEncodedImage] = useState('');
    const { user } = useAuthContext();
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
                console.log(imageDataUrl);
                current.src = e.target.result;
            }
            reader.readAsDataURL(file);

        }
    }



    return (
        <>
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
            </form >
        </>
    )
}

export default ProfilePicture;