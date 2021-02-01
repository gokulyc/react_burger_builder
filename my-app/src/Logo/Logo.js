import React from "react";
import FastfoodIcon from '@material-ui/icons/Fastfood';
import classes from "./Logo.css";
const logo =(props)=>(
    <div className={classes.Logo}><FastfoodIcon style={{height:props.height,color:"brown"}}/></div>
);

export default logo;