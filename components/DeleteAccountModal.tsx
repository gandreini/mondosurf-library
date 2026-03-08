'use client';

import Loader from 'mondosurf-library/components/Loader';
import modalService from 'mondosurf-library/services/modalService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useState } from 'react';

interface IDeleteAccountModal {
    onConfirm: () => void;
    isLoading: boolean;
}

const DeleteAccountModal: React.FC<IDeleteAccountModal> = (props) => {
    const [confirmText, setConfirmText] = useState('');
    const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

    return (
        <div className="ms-delete-account-modal">
            <p className="ms-body-text">{mondoTranslate('pro.delete_account_modal_text')}</p>

            <input
                type="text"
                className="ms-input"
                placeholder={mondoTranslate('pro.delete_account_input_placeholder')}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
                data-test="delete-account-input"
            />

            <button
                className="ms-btn ms-btn-cta ms-btn-l ms-btn-full"
                onClick={props.onConfirm}
                disabled={!isConfirmed || props.isLoading}
                data-test="delete-account-confirm-button">
                {props.isLoading ? (
                    <Loader size="small" />
                ) : (
                    mondoTranslate('pro.delete_account_modal_button')
                )}
            </button>

            <button
                className="ms-btn ms-btn-l ms-btn-full"
                onClick={() => modalService.closeModal()}>
                {mondoTranslate('basics.cancel')}
            </button>
        </div>
    );
};

export default DeleteAccountModal;
