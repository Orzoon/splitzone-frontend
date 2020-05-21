import React from 'react';
import "../../css/UIC.scss";
import {MdError, MdDone, MdClose} from "react-icons/md"
// they recive preDefined className as props
const LoaderButton = ({backgroundColor, color, height, fix}) => {
    let classNames =  "BTNLoader";
    if(backgroundColor){
        classNames = classNames + " " + backgroundColor;
    }
    // if(color){
    //     classNames = classNames + " " + color;
    // }
    if(height){
        classNames = classNames + " " + height;
    }
    if(fix){
        classNames = classNames + " " + fix;
    }
    let innerDivClassName = "BTN_L";

    if(color){
        innerDivClassName = innerDivClassName + " " + color;
    }
   return( <button className = {classNames} disabled>
        <div className = {innerDivClassName}></div>
        <div className = {innerDivClassName}></div>
        <div className = {innerDivClassName}></div>
    </button>) 
}



const CardConfirmation = ({response, messageTitle, message, closeHandler}) => {
    let classNamesBorder = "UIC_Line";
    if(response === "SUCCESS"){
        classNamesBorder = classNamesBorder + " UIC_Line_SUCCESS";
    }
    else {
        classNamesBorder = classNamesBorder + " UIC_Line_ERROR"
    }
    return (
        <div className = "UIC_C_Container">
            <div className = {classNamesBorder}></div>
            <div className = {classNamesBorder}></div>
            <div className = {classNamesBorder}></div>
            <div className = {classNamesBorder}></div>

            <div className = {response === "SUCCESS" ? "UIC_ICON_LEFT UIC_Line_SUCCESS": "UIC_ICON_LEFT UIC_Line_ERROR"}>
                {response === "SUCCESS" ? <MdDone /> : <MdError />}
            </div>
            {messageTitle && <h3>{messageTitle}</h3>}
            {message && <p>{message}</p>}
            <button className = "UIC_button" onClick = {closeHandler}>
                <MdClose />
            </button>
        </div>
    )
}


export {
    LoaderButton,
    CardConfirmation
}