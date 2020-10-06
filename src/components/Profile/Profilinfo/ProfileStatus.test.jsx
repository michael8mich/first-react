import React from "react";
import { create } from "react-test-renderer";
import ProfileStatus from "./ProfileStatus";

describe("Profile status component", () => {
    test("status from props should be im state", () => {
        const component = create(<ProfileStatus status="aaaaa" />);
        const instance = component.getInstance();
        expect(instance.state.status).toBe("aaaaa");
    });

    test("status from props should be im state", () => {
        const component = create(<ProfileStatus status="aaaaa" />);
        const root = component.root;
        const span = root.findByType("span");
        expect(span).not.toBeNull();
    });

    test("status from props should be im state", () => {
        const component = create(<ProfileStatus status="aaaaa" />);
        const root = component.root;
        expect(() => {
            let input = root.findByType("input")
        }).toThrow();
    });
    test("status from props should be im state", () => {
        const component = create(<ProfileStatus status="aaaaa" />);
        const root = component.root;
        const span = root.findByType("span");
        expect(span.children[0]).toBe("aaaaa");
    });

    test("input should be displayed in editMode instead of span", () => {
        const component = create(<ProfileStatus status="aaaaa" />);
        const root = component.root;
        let span = root.findByType("span");
        span.props.onDoubleClick();
        let input = root.findByType("input")
        expect(input.props.value).toBe("aaaaa");
    });

    // test("callback should be called", () => {
    //     const mocCallback = jest.fn();
    //     const component = create(<ProfileStatus status="aaaaa" setState={mocCallback} />);
    //     const instance = component.getInstance();
    //     instance.activateEditMode();
    //     expect(mocCallback.mock.calls.length).toBe(1);
    // });
});