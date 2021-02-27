import React, { Component } from "react";
import classes from "./Modal.css";
import HDiv from "../../../hoc/HDiv";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // return nextProps.show !== this.props.show;
    // return nextProps.show !== this.props.show || nextProps.modalClosed !==this.props.modalClosed;
    // return nextProps.show !== this.props.show || nextProps.children !==this.props.children;

    return true;

  }
  componentWillUpdate(){
    // console.log("Modal updates");
  }
  render() {
    return (
      <HDiv>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: this.props.show ? "1" : "0",
          }}
        >
          {this.props.children}
        </div>
      </HDiv>
    );
  }
}

export default Modal;
