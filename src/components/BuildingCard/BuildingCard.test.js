import React from "react";
import "@testing-library/jest-dom";
import { cleanup, render } from "@testing-library/react";

import BuildingCard from "./BuildingCard";

// Mock Data
const buildings = [
    {"BUILDING_ID": 0, "BUILDING_NAME": "Mathematical Science Labs", "TAGS": [{"TAG_ID": 0, "TAG_NAME": "Computer Labs"}]},
    {"BUILDING_ID": 1, "BUILDING_NAME": "Wits Science Stadium", "TAGS": [{"TAG_ID": 1, "TAG_NAME": "Tutorial Rooms"}, {"TAG_ID": 2, "TAG_NAME": "Lecture Halls"}]},
    {"BUILDING_ID": 2, "BUILDING_NAME": "FNB Building", "TAGS": [{"TAG_ID": 0, "TAG_NAME": "Computer Labs"}, {"TAG_ID": 1, "TAG_NAME": "Tutorial Rooms"}, {"TAG_ID": 2, "TAG_NAME": "Lecture Halls"}]},
    {"BUILDING_ID": 3, "BUILDING_NAME": "Old Mutual Sports Hall", "TAGS": []}
];

describe(BuildingCard, () => {
    it("should render BuildingCard", () => {
        const { getByTestId } = render(<BuildingCard buildingName={"Placeholder"}/>);

        const buildingCardElement = getByTestId("building-card");

        expect(buildingCardElement).toBeInTheDocument();
    });

    it("should have image prop", () => {
        const { getByRole } = render(<BuildingCard buildingName={"Placeholder"}/>);
        
        const imageElement = getByRole("img");

        expect(imageElement).toBeInTheDocument();
    });

    it("image prop should have correct alt text", () => {
        const { getByRole } = render(<BuildingCard buildingName={"Placeholder"}/>);
        
        const imageElement = getByRole("img");

        expect(imageElement.alt).toEqual("House icon");
    });

    it("should display the correct text through prop", () => {
        const {getAllByTestId} = render(
            <>
                {buildings.map((building) => (
                    <BuildingCard key={building.BUILDING_ID} buildingName={building.BUILDING_NAME}/>
                ))}
            </>
        );

        const textElements = getAllByTestId("building-card-text");

        textElements.forEach((textElement, index) => {
            expect(textElement.textContent).toEqual(buildings[index].BUILDING_NAME);
        });
    });

    it("should display correct building card tags", () => {
        buildings.forEach(building => {
            const { getByText } = render(<BuildingCard buildingName={building.BUILDING_NAME} buildingTags={building.TAGS} />);

            building.TAGS.forEach(tag => {
                const tagElement = getByText(tag.TAG_NAME);
                expect(tagElement).toBeInTheDocument();
            });

            cleanup(); // Manually clean up after each iteration
          });
    });
});
