import React from "react"


// style file
import "../../css/MidSectionV2/FriendsV2.scss";


// importing components
import TopBanner from "../V2SubFiles/FriendsV2Sub/TopBanner";
import Heading from "../V2SubFiles/FriendsV2Sub/Heading";
import OptionsBar from "../V2SubFiles/FriendsV2Sub/OptionsBar";
import FriendList from "../V2SubFiles/FriendsV2Sub/FriendList";

export default function FriendsV2(){
    return (
        <div className = "friendsV2_mainContainer">
            <div className = "FV2_Heading">
               <Heading/>
            </div>
            <div className = "FV2_topBannerContainer">
                <TopBanner/>
            </div>
            <div className = "FV2_optionsBarContainer">
                <OptionsBar/>
            </div>

            <ul className = "FV2_friendList">
                <FriendList />
            </ul>
        </div>
    )
}