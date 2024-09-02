import '@testing-library/jest-dom';
import { cleanup, render } from "@testing-library/react";

import CampusCard from "./CampusCard";


afterEach(() => {
    cleanup();
});


describe(CampusCard, () => {
    it("should render CampusCard", () => {
        const { getByTestId } = render(<CampusCard campusName={"Placeholder"}/>);

        const campusCardElement = getByTestId("campus-card");

        expect(campusCardElement).toBeInTheDocument();
    });

    it("should display the correct text through prop", () => {
        const campuses = ["West Campus", "East Campus"];
        
        const { getAllByTestId } = render(
            <>
                {campuses.map((campus) => (
                    <CampusCard key={campus} campusName={campus} />
                ))}
            </>
        );

        const textElements = getAllByTestId("campus-card-text");

        textElements.forEach((textElement, index) => {
            expect(textElement.textContent).toEqual(campuses[index]);
        });
    });
});