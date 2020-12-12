import React from "react";


import "../../../css/V2SubFiles/GroupsV2Sub/OptionsBar.scss";


// icons
import {MdViewList} from "react-icons/md";

export default function OptionsBar(){
    return (
        <>
            <button className = "GV2_ButtonListCardView">
                 <MdViewList />
            </button>

        </>
    )
}