import React from 'react';
import {Link} from "react-router-dom"

// css file
import "../../css/RightNav.scss"

export default function Rightnav(){
    const myWebsite = "http://orzoon.github.io/"
        return (
            <div className = "rightNavContainer">
                <MyLinkCard myWebsite = {myWebsite}/>
            </div>
    )
}


function MyLinkCard({myWebsite}){
    return(
        <div className = "rightNavCardContainer">
                <div className = "Text_LOGO_Container_RIGHT">
                    <h1 className = "LOGO_TEXT_RIGHT">SplitZone</h1>
                    <p className = "LOGO_PARA_RIGHT">Bill spliting Demo</p>
                </div>
                <p className = "right_para">Made with love by <u>Arjun Kunwar</u></p>
                <a href = {myWebsite} target="_blank" rel = "noopener noreferrer">
                    profile
                </a>
        </div>
    )
}