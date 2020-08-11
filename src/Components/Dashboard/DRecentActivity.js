import React, {useContext} from "react";
import {AppUserContext} from "../App/App";
import {LoaderButton} from "../UIC/UIC";

export default function DRecentActivity({
    recentActivitiesInfo, 
    getAdditionalActivityData,
    loadActivity
}){
    const userID = useContext(AppUserContext)._id;

    return (
        <ul className = "DRecentActivity_container">
            {recentActivitiesInfo && recentActivitiesInfo.activities.map((activity,index) => {
             const list = (<li key = {activity._id}>
                                {/* LINE STYLE */}
                                <div className = {index === (recentActivitiesInfo.activities.length-1) ? "DeFlowLine DeFlowLineEnd":  "DeFlowLine"}></div>
                                {/* Activity Text */}
                                { activity.invokedBy ? 
                                    <p>
                                        {/* INVOKEDBY NAME -> TITLES */}
                                        {activity.invokedBy._id === userID ? 
                                            <span className = "AP_Username">You </span> :  
                                            <span className = "AP_Username">{activity.invokedBy.name} </span>
                                        }
                                        {/* Check for CREATED_VALUE group activity or bill activity  or userActivity*/}
                                           {/* ACTIVITY */}
                                        {   
                                            activity.activityUserId ? 
                                                <>
                                                <span
                                                    className = "AP_Activity AP_Blue"
                                                >  {
                                                        activity.activity === "signedIn" ? "logged in" :
                                                        activity.activity === "signedUp" ? "Signed up" :
                                                        "Updated"
                                                    }
                                                </span> at </>: 
                                            activity.activityGroupId ? 
                                                <span 
                                                    className = {
                                                        activity.activity === "created" ? "AP_Activity AP_Green": 
                                                        activity.activity === "deleted" ? "AP_Activity AP_Red":
                                                        activity.activity === "added" ? "AP_Activity AP_Green":
                                                        "AP_Activity AP_Yellow"
                                                    }>{activity.activity}
                                                </span>: 
                                            " "
                                        }
                                        {/* AFTER ACTIVITY*/}
                                        {/* <span className = "AP_Member_name"> {activity.member.name}</span> */}
                                        {/* <span className = "AP_Member_name">{activity.member.name}</span> */}
                                        {
                                            (activity.activityGroupId && (activity.activity === "created" || activity.activity === "deleted")) ? <> a group <span className = "AP_GroupName">{activity.groupName}</span> at </> :
                                            (activity.activityGroupId && activity.activity === "added") ? <> 
                                                {activity.groupParties.filter(item => item._id.toString() === userID.toString())
                                                    .map(item => {
                                                            if(item._id.toString() !== activity.invokedBy._id.toString()){
                                                                return <span className = "AP_Member_name"> You </span>
                                                            }else{
                                                                return <span className = "AP_Member_name"> {activity.member.name} </span>
                                                            }
                                                    })
                                                } 
                                            to the group  <span className = "AP_GroupName">{activity.groupName}</span> at </> :
                                            (activity.activityGroupId && activity.activity === "removed") ? <> 
                                               {activity.groupParties.filter(item => item._id.toString() === userID.toString())
                                                    .map(item => {
                                                            if(item._id.toString() !== activity.invokedBy._id.toString()){
                                                                return <span className = "AP_Member_name"> You </span>
                                                            }else{
                                                                return <span className = "AP_Member_name"> {activity.member.name} </span>
                                                            }
                                                    })
                                                }                                             
                                            from the group  <span className = "AP_GroupName">{activity.groupName}</span> at </> :
                                            (activity.activityUserId && activity.acitvity === "updated") ? "your details":  
                                            ''
                                        }
                                        {/* ACTIVITY TIME*/}                                 
                                         <span className = "AP_Date">{new Date(activity.createdAt).toLocaleString() }</span>                 
                                    </p> : 
                                    " "
                                }
                            </li>)
                return list
            })}
            
            {/* Load More Button */}
            {(recentActivitiesInfo && recentActivitiesInfo.stepInfo.exists )  ? 
                <li className = {loadActivity ? "loadMoreList loadMoreListBUTTONFix": "loadMoreList"}>
                    {/* LoaderButton */}
                    {loadActivity &&
                        <LoaderButton fix = "ACTIVITY_FIX" color = "Button_Blue_color"/>
                    }

                    {!loadActivity
                        &&
                           <button 
                           onClick = {() => {
                                   getAdditionalActivityData()
                           }}>Load More</button>

                    }
                </li> : 
                null}
        </ul>
    )
}