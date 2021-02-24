import React from 'react';

import Logo from '../../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import HDiv from '../../../hoc/HDiv';

const sideDrawer = ( props ) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <HDiv>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                <a href="/"><Logo height="100%" /></a>
                    {/* <Logo height="100%"/> */}
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </HDiv>
    );
};

export default sideDrawer;