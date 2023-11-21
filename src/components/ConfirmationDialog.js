const ConfirmationDialog = ({ message, onCancel, onConfirm, confirmationDialogRef, showConfirmationDialog }) => {
    console.log('confirmationDialogRef', confirmationDialogRef);
    return (
        <div className={`${!showConfirmationDialog && 'd-none'} confirmation-dialog`} ref={confirmationDialogRef} tabIndex={0}>
            <p>{message}</p>
            <div className="button-container d-flex">
                <button onClick={onConfirm} className='cta-btn btn-sm cta-btn__alt'>Confirm</button>
                <button onClick={onCancel} className='cta-btn btn-sm cancel-btn'>Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
