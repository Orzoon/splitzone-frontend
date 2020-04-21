import React, {useEffect, useState, useContext} from 'react';

import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
/* D_Components Imports */
import DBanner from "../Dashboard/DBanner";
import LineChart from "../Dashboard/LineChart";
import {AppUserContext} from "../App/App";
// scss style
import "../../css/Dashboard.scss";

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
                <DTotalAmount />
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
            <p></p>
            <h3>Total bills</h3>
        </div>
    )
}

function DTotalGroups(props){
    return (
        <div className = "DTotalGroups">
            <h2>{props.totalGroupsNo ? props.totalGroupsNo: 0}</h2>
            <p></p>
            <h3>Total groups</h3>
        </div>
    )
}

function DTotalAmount(props){
    return (
        <div className = "DTotalAmount">
        </div>
    )
}

function DRecentActivity(props){
    const userID = useContext(AppUserContext)._id;
    const [recentActivities, setRecentActivities] = useState(null)
    useEffect(() => {
        async function test(){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/activitysummary`, {
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
                setRecentActivities(responseData)
            }
            catch(error){
    
            }
        }

        test();
    },[])
    return (
        <ul className = "DRecentActivity_container">
            {recentActivities && recentActivities.map((activity) => {
             const list = (<li key = {activity._id}>

                                {/* LINE STYLE */}
                                <div className = "DeFlowLine"></div>
                                {/* Activity Text */}
                                { activity.invokedBy ? 
                                    <p>
                                        {activity.invokedBy._id === userID ? 
                                            <span className = "AP_Username">You </span> :  
                                            <span className = "AP_Username">{activity.invokedBy.name}</span>
                                        }
                                        {/* Check for CREATED_VALUE group activity or bill activity */}
                                        {
                                            activity.activityGroupId ? 
                                            <span 
                                                className = {
                                                    activity.activity === "created" ? "AP_Activity AP_Green": 
                                                    activity.activity === "deleted" ? "AP_Activity AP_Red":
                                                    "AP_Activity AP_Blue"
                                                }> {activity.activity}
                                            </span>: 
                                            " "
                                        }
                                        {
                                            (activity.activityGroupId && activity.activity) ? <> a group <span className = "AP_GroupName">{activity.groupName}</span> </> : 
                                            ''
                                        }
                                    </p> : 
                                    " "
                                }
                            </li>)
                return list
            })}
        </ul>
    )
}



