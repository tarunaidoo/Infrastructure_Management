import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import RoomCard from "./RoomCard";

// Mock Data
const rooms = [
    {"ROOM_ID": 0, "ROOM_NAME": "MSL001"},
    {"ROOM_ID": 1, "ROOM_NAME": "MSL002"},
    {"ROOM_ID": 2, "ROOM_NAME": "MSL003"},
    {"ROOM_ID": 3, "ROOM_NAME": "MSL004"},
    {"ROOM_ID": 4, "ROOM_NAME": "MSL005"},
    {"ROOM_ID": 5, "ROOM_NAME": "MSL006"},
]


describe(RoomCard, () => {
    it("should render RoomCard", () => {
        const { getByTestId } = render(<RoomCard roomName={"Placeholder"}/>);

        const roomCardElement = getByTestId("room-card");

        expect(roomCardElement).toBeInTheDocument();
    });

    it("should have image prop", () => {
        const { getByRole } = render(<RoomCard roomName={"Placeholder"}/>);
        
        const imageElement = getByRole("img");

        expect(imageElement).toBeInTheDocument();
    });

    it("image prop should have correct alt text", () => {
        const { getByRole } = render(<RoomCard roomName={"Placeholder"}/>);
        
        const imageElement = getByRole("img");

        expect(imageElement.alt).toEqual("arrow door in icon");
    });

    it("should display the correct text through prop", () => {
        const {getAllByTestId} = render(
            <>
                {rooms.map((room) => (
                    <RoomCard key={room.ROOM_ID} roomName={room.ROOM_NAME}/>
                ))}
            </>
        );

        const textElements = getAllByTestId("room-card-text");

        textElements.forEach((textElement, index) => {
            expect(textElement.textContent).toEqual(rooms[index].ROOM_NAME);
        });
    });
});