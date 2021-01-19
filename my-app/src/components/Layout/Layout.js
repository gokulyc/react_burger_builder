import React from "react";

import HDiv from "../../hoc/HDiv";
import classes from "./Layout.css";

const layout = (props) => (
  <HDiv>
    <div>Toolbar, SideDrawer, Backdrop</div>
    <main className={classes.Content}>{props.children}</main>
  </HDiv>
);

export default layout;
