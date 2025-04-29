import React from 'react';
import '../styles/HomePage.css';

const Modal = ({ children, onClose }) => {
    return (
        <div className="key-modal-overlay" onClick={onClose}>
            <div className="key-modal" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
