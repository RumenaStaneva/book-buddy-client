import '../styles/Modal.scss'
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import Modal from './Dialog'
import Spinner from 'react-spinner-material';
import AvatarEditor from 'react-avatar-editor';

const AvatarEditorModal = ({ setIsOpen, setEditor, encodedImage, scale, setScale, setEncodedImage, isLoading, setIsLoading, editor, previousElement }) => {
    const { user, dispatch } = useAuthContext();
    const dispatchError = useDispatch();
    // console.log(previousElement);
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
                    setScale(1);
                    setEditor(null);
                    setIsOpen(false);
                    document.body.style.overflow = 'visible';
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

    return (
        <Modal
            title={'Edit profile picture'}
            onClose={() => { setIsOpen(false); }}
            subtitle={``}
            setIsOpen={setIsOpen}
            //todo fix focus
            previousElement={document.body}
            content={

                isLoading ? (
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                ) : (
                    <div className="editor-container">
                        <AvatarEditor
                            ref={(editor) => setEditor(editor)}
                            image={encodedImage}
                            width={300}
                            height={300}
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
                )

            }
        />
    );
};
export default AvatarEditorModal;