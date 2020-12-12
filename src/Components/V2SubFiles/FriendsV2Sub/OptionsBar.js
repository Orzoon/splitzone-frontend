import React from "react";



// scss file
import "../../../css/V2SubFiles/FriendsV2Sub/OptionsBar.scss";

// icons
import {MdViewList} from "react-icons/md";

export default function OptionsBar(){
    return (
        <>
            <button className = "FV2_ButtonListCardView">
                 <MdViewList />
            </button>

        </>
    )
}