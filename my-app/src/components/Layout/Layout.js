import React, { Component } from 'react';

import HDiv from "../../hoc/HDiv";
import classes from "./Layout.css";

import Toolbar from "../navigation/Toolbar/Toolbar";
import SideDrawer from '../navigation/SideDrawer/SideDrawer';
class Layout extends Component {
  state = {
      showSideDrawer: false
  }

  sideDrawerClosedHandler = () => {
      this.setState( { showSideDrawer: false } );
  }

  sideDrawerToggleHandler = () => {
      this.setState( ( prevState ) => {
          return { showSideDrawer: !prevState.showSideDrawer };
      } );
  }

  render () {
      return (
          <HDiv>
              <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
              <SideDrawer
                  open={this.state.showSideDrawer}
                  closed={this.sideDrawerClosedHandler} />
              <main className={classes.Content}>
                  {this.props.children}
              </main>
          </HDiv>
      )
  }
}

export default Layout;