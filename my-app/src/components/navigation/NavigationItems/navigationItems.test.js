import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NavigationItems from "./NavigationItems";
import NavigationItem from "./NavigationItem/NavigationItem";

configure({ adapter: new Adapter() });

describe("<NavigationItems/> Component Tests", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });
    it("should render 2 nav items if not authenticated", () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it("should render 3 nav items if authenticated", () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it("should not contain logout nav item if not authenticated", () => {
        expect(
            wrapper.contains(
                <NavigationItem link="/logout">Logout</NavigationItem>
            )
        ).toEqual(false);
    });

    it("should contain logout nav item if authenticated", () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(
            wrapper.contains(
                <NavigationItem link="/logout">Logout</NavigationItem>
            )
        ).toEqual(true);
    });
});
