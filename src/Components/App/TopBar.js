import React, {useContext, useState} from 'react'

import {AppUserContext, notificationContext, socketContext} from "./App";
// ICONS REACT-ICONS
import {MdNotifications} from 'react-icons/md';

// CSS
import '../../css/TopBar.scss';



export default function TopBar(props){
    const logoAvailable = false;
    const user = useContext(AppUserContext);
    return (
        <div className = "topBarContainer">
            {
                logoAvailable ? <SplitzoneLogo /> : 
                <div className = "Text_LOGO_Container">
                    <h1 className = "LOGO_TEXT">SplitZone</h1>
                    <p className = "LOGO_PARA">Bill spliting Demo</p>
                </div>
            }
           <NotificationIcon />
           <ProfileNameIcon user = {user}/>
        </div>
    )
}



/********************* 
MINI TOPBAR COMPONENTS 
*********************/
function SplitzoneLogo(){
    return <img src = "" alt = "logoImage" />
}

function NotificationIcon(){
    const notification= useContext(notificationContext);
    const socket = useContext(socketContext)
    socket.on('S_NotificationCount', () => {
        notification.setNotificationCount(prevCount => prevCount + 1)
    })

    function ResetNotification(){
        notification.setNotificationCount(0)
        
    }
    return (<div  className = "notificationIcon" onClick = {ResetNotification}>
                <div className = "notificationIconDiv">
                    <MdNotifications />
                    <h1>
                    {notification.notificationCount}
                    </h1>
                </div>
            </div>)
}

function ProfileNameIcon(props){
    return (
        <div  className = "profileNameIcon">
            {/* check for profile image if profile Image */}
            <div className = "profileImage">
               {props.user ? props.user.username.charAt(0).toUpperCase() + props.user.username.charAt(1).toUpperCase(): ".."}
            </div>
            <h3>{props.user && props.user.username.replace(props.user.username.charAt(0), props.user.username.charAt(0).toUpperCase())}</h3>
        </div>
    )
}



