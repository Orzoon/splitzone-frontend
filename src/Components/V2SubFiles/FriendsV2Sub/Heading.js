import React from "react";


// style file
import "../../../css/V2SubFiles/FriendsV2Sub/Heading.scss";

// importing components

// icons
import {MdAdd} from "react-icons/md";



function Heading(){

    return (
        <>
            <h1>Friends</h1>
            <button className ="FV2_addFriendBtn"> 
                <span className = "buttonIcon"><MdAdd /></span> 
                <span className = "buttonText">Add friend</span>
            </button>

        </>
    ) 
}


export default Heading;