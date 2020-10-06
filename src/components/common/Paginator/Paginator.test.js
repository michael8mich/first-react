import React from "react";
import { create } from "react-test-renderer";
import Paginator from "./Paginator";

describe("Paginator component tests", () => {
    test("page count is 4 but should be shown only 2", () => {
        const component = create(<Paginator totalItemsCount={4} pageSize={1} portionSize={2} />);
        const root = component.root;
        let span = root.findAllByType("span");
        expect(span.length).toBe(2);
    });
    test("if page count is more then 3 and pageSize =1 buton next should be present", () => {
        const component = create(<Paginator totalItemsCount={4} pageSize={1} portionSize={2} />);
        const root = component.root;
        let button = root.findAllByType("button");
        expect(button.length).toBe(1);
    });

    test("if page count is more then 4 and pageSize =2  prev should be present", () => {
        const component = create(<Paginator totalItemsCount={5} pageSize={2} portionSize={2} />);
        const root = component.root;
        let button = root.findAllByType("button");
        expect(button.length).toBe(1);
    });

});