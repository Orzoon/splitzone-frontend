import React, {useEffect, useState, useContext} from 'react';

import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
/* D_Components Imports */
import DBanner from "../Dashboard/DBanner";
import LineChart from "../Dashboard/LineChart";
import {AppUserContext} from "../App/App";
// scss style
import "../../css/Dashboard.scss";

// ICONS  DS
import {MdReceipt,MdGroup,MdAttachMoney,MdCollectionsBookmark} from 'react-icons/md';
export default function Dashboard(props){
    const [misc, setMisc] = useState(null)
    useEffect(() => {
        async function getMisc(){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/misc`, {
                                    method: "GET",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '+ token
                                    }
                                })
                if(!response.status === 200){
                    throw new Error("something went wrong")
                }
                const responseData = await response.json();
                console.log("misc", responseData)
                setMisc(responseData)
            }
            catch(error){
    
            }
        }

        getMisc();
    }, [])

    return (
        <div className = "dashboardContainer">
            <DBanner />
            <div className = "DS_container">
                <h1>Overview</h1>
                <DTotalGroups totalGroupsNo = {misc ? misc.totalGroups : ""}/>
                <DTotalBills totalBillsNo = {misc ? misc.totalBills : ""}/>
                <DTotalAmount totalBalance = {misc ? misc.totalBalance: ""} />
            </div>
            <div className = "DLineChart_wrapper">
                <h1>Bill summary</h1>
                <LineChart />
            </div>
            <div className = "DRecentActivity_wrapper">
                <h1>Recent activities</h1>
                <DRecentActivity />
            </div>
        </div>
    )
}

/* MISC_Components */

function DTotalBills(props){
    return (
        <div className = "DTotalBills">
            <h2>{props.totalBillsNo ? props.totalBillsNo: 0}</h2>
            <div  className = "DS_IconB">
                 <MdReceipt />
            </div>
            <h3>Total bills</h3>
        </div>
    )
}

function DTotalGroups(props){
    return (
        <div className = "DTotalGroups">
            <h2>{props.totalGroupsNo ? props.totalGroupsNo: 0}</h2>
            <div >
                <MdCollectionsBookmark />          
            </div>
            <h3>Total groups</h3>
        </div>
    )
}

function DTotalAmount(props){
    return (
        <div className = "DTotalAmount">
            <h2>{props.totalBalance ? props.totalBalance: 0}</h2>
            <div className = "DS_IconA">
                <MdAttachMoney />             
            </div>
            <h3>Total balance</h3>
        </div>
    )
}

function DRecentActivity(props){
    const userID = useContext(AppUserContext)._id;
    const [recentActivitiesInfo, setRecentActivitiesInfo] = useState(null);
    const [request, setRequest] = useState(false);
    const [step, setStep] = useState(1);
    useEffect(() => {
        async function getActivities(stepCount){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/activitysummary?step=${stepCount}`, {
                                    method: "GET",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '+ token
                                    }
                                })
                if(!response.status === 200){
                    throw new Error("something went wrong")
                }
                const responseData = await response.json();
                console.log("activity",responseData);
                
                // Setting Activities
                setRecentActivitiesInfo(responseData)
            }
            catch(error){
            }
        }
        getActivities(step);
    },[request])
    
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
                                            <span className = "AP_Username">{activity.invokedBy.name}</span>
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
                                        {
                                            (activity.activityGroupId && (activity.activity === "created" || activity.activity === "deleted")) ? <> a group <span className = "AP_GroupName">{activity.groupName}</span> at </> :
                                            (activity.activityGroupId && activity.activity === "added") ? <> <span className = "AP_Member_name">{activity.member.name}</span> to the group  <span className = "AP_GroupName">{activity.groupName}</span> at </> :
                                            (activity.activityGroupId && activity.activity === "removed") ? <> <span className = "AP_Member_name">{activity.member.name}</span> from the group  <span className = "AP_GroupName">{activity.groupName}</span> at </> :
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
                <li className = "loadMoreList">
                    <button onClick = {() => {
                            setStep((prevStep) => prevStep + 1);
                            setRequest(!request)
                        }}>Load More</button>
                </li> : 
                null}
          

        </ul>
    )
}



