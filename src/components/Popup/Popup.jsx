import React from "react";

import "./Popup.css";


const Popup = ({trigger, children}) => {
    return (trigger) ? (
        <main className="popup-center-container">
            <section className="popup-container">
                <article className="popup-content">
                    {children}
                </article>
            </section>
        </main>
    ) : "";
};

export default Popup;
