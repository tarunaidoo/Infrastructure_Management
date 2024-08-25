import React from "react";

import Header from "../../components/NavigationHeader/NavigationHeader";
import CampusCard from "../../components/CampusCard/CampusCard";

import "./CampusSelectionPage.css";


const CampusSelectionPage = () => {
    // Variables

    // Function & Logic

    // HTML code
    return (
        <>
            <Header title={"Choose a Campus"}/>
            <main className="centered-container">
                <section className="campus-selection-content-section">
                    <CampusCard campusName={"East Campus"}/>

                    <CampusCard campusName={"West Campus"}/>
                </section>
            </main>
        </>
    );
}

export default CampusSelectionPage;
