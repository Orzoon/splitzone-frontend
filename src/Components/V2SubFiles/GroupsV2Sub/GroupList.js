import React from "react";


// style file
import "../../../css/V2SubFiles/GroupsV2Sub/GroupList.scss";


export default function  GroupList(){
    return (
        <>
            <li className = "GV2_listHeading">
                {/* future fill ---leave empty for now */}
                <h2>Name</h2>
                <h2>Members</h2>
                <h2>Total Bills</h2>
                <h2>Details</h2>
            </li>

            <li>    
                    <div className="nameContainer">
                        <h1>ArjunsGroup</h1>
                        <h2>12 Dec 2020</h2>
                    </div>

                    <div className = "members">
                        {/* fill later */}
                        {/* show limited profile pic and rest numbers*/}
                        <ul>
                             {/* later adjust with image tag */}
                            <li>
                                AK
                            </li>
                            <li>
                                BK
                            </li>
                            <li>
                                ss
                            </li>
                            <li>
                                +7
                            </li>
                        </ul>
                    
                    </div>
                    
                    <h1 className = "bills">20</h1>
                    <button class="FV2_viewDetails">
                        View
                    </button>
            </li>
        </>
    )
}