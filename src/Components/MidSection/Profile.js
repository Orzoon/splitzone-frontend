import React, {useContext, useState} from 'react';
import {AppUserContext} from "../App/App";

// scss
import "../../css/Profile.scss";
import {
    MdSettings,
    MdPerson,
    MdDelete,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp
} from "react-icons/md";

export default function Profile(){

    return (
        <div className = "profileContainer">
           <ProfileBanner />
           <ProfileSettings />
           <ProfileLimitations />
           <ProfileDeletion />
        </div>
    )
}


function ProfileBanner(){
    const userInfo = useContext(AppUserContext);
    return (
        <div className = "ProfileBannerContainer">
            {/* EDGE CIRCLES STYLES */}


            {/* EDGE CIRCLES END */}
            <div className = "ProfilePicContainer">
                {userInfo.image ? 
                    <img alt = "profileImage" className = "ProfileImage"/>:
                    <h1 className = "profileImage">{userInfo ? userInfo.username.charAt(0) + userInfo.username.charAt(1): ""}</h1>
                }

                {/* USER TYPE POSITION ABSOLUTE */}
                {userInfo.type ? <h2>App Name</h2> : <h2>Normal</h2>}
            </div>
            <h1 className = "h1Username">{userInfo.username}</h1>
            <h2>{userInfo.email}</h2>
        </div>)
}

function ProfileSettings(){
    const [expand, setExpand] = useState(false);
    function setExpandHandler(){
        setExpand(!expand)
    }
    return (
        <div className = {expand ? "ProfileSettings": "normalDiv"} >
            <div onClick = {setExpandHandler} className = "profileCardCommonUpper settingsUpperSection">
                <div className = "commonPIcon commonPIconFirst">
                    <MdSettings />
                </div>
                <div className = "commonPText">
                    <h1>Adjust your application settings </h1>
                </div>
                <div className = "commponExpandButton">
                    {!expand ? <MdKeyboardArrowDown />: <MdKeyboardArrowUp/> }
                </div>
            </div>
            {expand ? 
                <div className = "profileCardCommonLower">options Section</div> : 
                null
            }
        </div>
    )
}

function ProfileLimitations(){
    const [expand, setExpand] = useState(false);
    function setExpandHandler(){
        setExpand(!expand)
    }
    return (
        <div className = {expand ? "ProfileLimitations": "normalDiv"}>
            <div onClick = {setExpandHandler} className = "profileCardCommonUpper limitationUpperSection">
                <div className = "commonPIcon commonPIconSecond">
                  <MdPerson />
                </div>
                <div className = "commonPText">
                    <h1>Know more about your Account</h1>
                </div>
                <div className = "commponExpandButton">
                    {!expand ? <MdKeyboardArrowDown />: <MdKeyboardArrowUp/> }
                </div>
            </div>


            {/* ProfileCardCommonLower */}
            {expand ? 
                <div className = "profileCardCommonLower">options Section</div> : 
                null
            }
        </div>
    )
}
function ProfileDeletion(){
    const [expand, setExpand] = useState(false);
    function setExpandHandler(){
        setExpand(!expand)
    }
    return (
        <div className = {expand ? "ProfileDeletion": "normalDiv"}>
            <div onClick = {setExpandHandler} className = "profileCardCommonUpper deletionUpperSection">
                <div className = "commonPIcon commonPIconThird">
                    <MdDelete />
                </div>
                <div className = "commonPText">
                    <h1>Delete your account</h1>
                </div>
                <div className = "commponExpandButton">
                    {!expand ? <MdKeyboardArrowDown />: <MdKeyboardArrowUp/> }
                </div>
            </div>
            {expand ? 
                <div className = "profileCardCommonLower">options Section</div> : 
                null
            }
        </div>
    )
}