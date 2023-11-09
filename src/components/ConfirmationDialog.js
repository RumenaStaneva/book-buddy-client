const ConfirmationDialog = ({ message, onCancel, onConfirm }) => {
    return (
        <div className="confirmation-dialog">
            <p>{message}</p>
            <div className="button-container d-flex">
                <button onClick={onConfirm} className='cta-btn btn-sm cta-btn__alt'>Confirm</button>
                <button onClick={onCancel} className='cta-btn btn-sm cancel-btn'>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
