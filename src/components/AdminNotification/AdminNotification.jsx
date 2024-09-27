import React from 'react';

const AdminNotification = ({ arrayOfNames, arrayOfCorrespondingvenues, onClose }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <h2>Today's Issues</h2>
                <ul>
                    {arrayOfNames.map((name, index) => (
                        <li key={index}>
                            {name} - {arrayOfCorrespondingvenues[index]}
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AdminNotification;
