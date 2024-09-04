import React from "react";
import '@testing-library/jest-dom';
import { render } from "@testing-library/react";

import BuildingTag from "./BuildingTag";

// Mock Data
const tags = ["Computer Labs", "Tutorial Rooms", "Lecture Halls"];


describe(BuildingTag, () => {
    it("should render BuildingTag", () => {
        const { getByTestId } = render(<BuildingTag tagName={"Placeholder"}/>);

        const buildingTagElement = getByTestId("building-tag");

        expect(buildingTagElement).toBeInTheDocument();
    });

    it("should display the correct text through prop", () => {
        const { getAllByTestId } = render(
            <>
                {tags.map((tag) => (
                    <BuildingTag key={tag} tagName={tag} />
                ))}
            </>
        );

        const textElements = getAllByTestId("building-tag-text");

        textElements.forEach((textElement, index) => {
            expect(textElement.textContent).toEqual(tags[index]);
        });
    });
});