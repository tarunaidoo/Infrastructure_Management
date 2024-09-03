import '@testing-library/jest-dom';
import { render } from "@testing-library/react";

import CampusCard from "./CampusCard";

//Mock Data
const campuses = ["West Campus", "East Campus"];


describe(CampusCard, () => {
    it("should render CampusCard", () => {
        const { getByTestId } = render(<CampusCard campusName={"Placeholder"}/>);

        const campusCardElement = getByTestId("campus-card");

        expect(campusCardElement).toBeInTheDocument();
    });

    it("should display the correct text through prop", () => {
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