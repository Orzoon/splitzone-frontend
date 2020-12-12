import React from "react"


// style file
import "../../css/MidSectionV2/GroupsV2.scss";


// importing components
import Heading from "../V2SubFiles/GroupsV2Sub/Heading";
import TopBanner from "../V2SubFiles/GroupsV2Sub/TopBanner";
import OptionsBar from "../V2SubFiles/GroupsV2Sub/OptionsBar";
import GroupList from "../V2SubFiles/GroupsV2Sub/GroupList";

export default function GroupsV2(){
    return (
        <div className = "groupsV2_mainContainer">
            <div className = "GV2_Heading">
               <Heading/>
            </div>
            <div className = "GV2_topBannerContainer">
                <TopBanner/>
            </div>
            <div className = "GV2_optionsBarContainer">
                <OptionsBar/>
            </div>

            <ul className = "GV2_groupList">
                <GroupList />
            </ul>
        </div>
    )
}