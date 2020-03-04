import React from 'react'



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


function ProfileNameIcon(){
    return (
        <div  className = "profileNameIcon">
            {/* check for profile image if profile Image */}
            <div className = "profileImage">
                AK
            </div>
            <h3>ArjunKunwarddadadadadadad</h3>
        </div>
    )
}

















/********************* 

MAIN TOPBAR COMPONENT

*********************/


export default function TopBar(props){
    return (
        <div className = "topBarContainer">
           <SplitzoneLogo /> 
           <NotificationIcon />
           <ProfileNameIcon />
        </div>
    )
}

