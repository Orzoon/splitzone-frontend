import React, {useContext} from 'react'

import {AppUserContext} from "./App";

// ICONS REACT-ICONS
import {MdNotifications} from 'react-icons/md';

// CSS
import '../../css/TopBar.scss';




/********************* 

MINI TOPBAR COMPONENTS 

*********************/



function SplitzoneLogo(){
    return <img src = "" alt = "logoImage" />
}



function NotificationIcon(){
    return (<div  className = "notificationIcon">
                <MdNotifications />
        </div>)
}


function ProfileNameIcon(props){
    return (
        <div  className = "profileNameIcon">
            {/* check for profile image if profile Image */}
            <div className = "profileImage">
                AK
            </div>
            <h3>{props.user && props.user.username.replace(props.user.username.charAt(0), props.user.username.charAt(0).toUpperCase())}</h3>
        </div>
    )
}

















/********************* 

MAIN TOPBAR COMPONENT

*********************/


export default function TopBar(props){
    const user = useContext(AppUserContext);
    return (
        <div className = "topBarContainer">
           <SplitzoneLogo /> 
           <NotificationIcon />
           <ProfileNameIcon user = {user}/>
        </div>
    )
}

