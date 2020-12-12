import React from "react";

// scss
import "../../../css/V2SubFiles/GroupsV2Sub/Heading.scss";

// icons
import {MdAdd} from "react-icons/md";


export default function Heading(){
    return (
        <>
            <h1>Groups</h1>
            <button className ="GV2_createGroupBtn"> 
                <span className = "buttonIcon"><MdAdd /></span> 
                <span className = "buttonText">Create group</span>
            </button>
        </>
    )


}