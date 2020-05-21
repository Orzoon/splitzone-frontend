import React, {useEffect, useContext, useReducer} from 'react';

import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
/* D_Components Imports */
import ComLoader from "./ComLoader";
import DBanner from "../Dashboard/DBanner";
import LineChart from "../Dashboard/LineChart";
import {AppUserContext, socketContext, notificationContext} from "../App/App";

import {MdError} from "react-icons/md";
// scss style
import "../../css/Dashboard.scss";

// ICONS  DS
import {MdReceipt,MdAttachMoney,MdCollectionsBookmark} from 'react-icons/md';

/* DASHBOARD REDUCER */
function DashboardReducer(state, action){
    switch(action.type){
        case "miscDataSet":
            return {...state, miscData: action.payload}
        
        case "lineGraphDataSet":
            return {...state, lineGraphData: action.payload}

        case "activityDataSet":
            return {...state, activityData: action.payload}
        
        case "stepCount":
            return {...state, stepCount: state.stepCount + 1}

        case "loading":
            return {...state, loading: action.payload}

        case "activityLoading":
            return {...state, loadActivity: action.payload}
        /* SOCKET IO EVENTS */
        case "S_ActivityDataDashboard": 
            const activityDataCopy = {...state.activityData}
            const activitiesAdded = [action.payload, ...activityDataCopy.activities]
            activityDataCopy.activities = activitiesAdded;
            return {...state, activityData: activityDataCopy}
        default:
        return state
    }
}

/* INITIAL DATA */
const initialDashboardState = {
    miscData: null,
    lineGraphData: null,
    activityData: null,
    loading: true,
    stepCount: 1,
    loadActivity: false
}

export default function Dashboard(props){
    const notification= useContext(notificationContext);
    const socket = useContext(socketContext)
    const [state, dispatch] = useReducer(DashboardReducer, initialDashboardState)

    useEffect(() => {
        async function getDashboardData(){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const miscResponse = await fetch(`${serverURI}/api/app/misc`, {
                                    method: "GET",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '+ token
                                    }
                                })
                
                const lineChartResponse = await fetch(`${serverURI}/api/app/summary?currentMonth=currentMongth`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                })

                const activityResponse = await fetch(`${serverURI}/api/app/activitysummary?step=${state.stepCount}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                })


                if(!miscResponse.status === 200 || !lineChartResponse.status === 200 || !activityResponse.status === 200){
                    throw new Error("something went wrong")
                }
                const [MiscresponseData, lineChartResponseData, activityResponseData] = [await miscResponse.json(), await lineChartResponse.json(), await activityResponse.json()];
                dispatch({type: "miscDataSet", payload: MiscresponseData})    
                dispatch({type: "activityDataSet", payload: activityResponseData})    
                /* formatting LineGraphData */
                const responseData = lineChartResponseData;
              
                // processing data
                const responseDataPropArray = Object.keys(responseData);
                const currentMonthLabel = [];
                const previousMonthLabel = [];
                const currentMonthData = [];
                const previousMonthData = [];
                function getDates(year, month){
                    const date = new Date(year,month, 0).getDate();
                    return date;
                }
                for(let i = 0; i < responseDataPropArray.length - 1; i ++){
                    if(responseData[responseDataPropArray[i]].length > 0){
                        const year = new Date(responseData[responseDataPropArray[i]][i].paidDate).getFullYear();
                        const month = new Date(responseData[responseDataPropArray[i]][i].paidDate).getMonth();
                        const totalDays = getDates(year, month);
                        // for currentMonth
                        if(i === 0){
                            for(let j = 1; j <= totalDays ; j++){
                                currentMonthLabel.push(j);
                                currentMonthData.push(0);
                            }
                            const currentMonthResponse = responseData[responseDataPropArray[i]]
                            for(let i = 0 ; i < currentMonthResponse.length; i++){
                                const getDate = new Date(currentMonthResponse[i].paidDate).getDate();
                                currentMonthData[getDate] = parseInt(currentMonthResponse[i].amount.toFixed(2), 10);
                            }
                            const currentToday = new Date().getDate();
                            currentMonthData.splice(currentToday+1)
                        }
                        if(i === 1){
                            for(let j = 1; j <= totalDays ; j++){
                                previousMonthLabel.push(j);
                                previousMonthData.push(0);
                            }
                            const previousMonthResponse = responseData[responseDataPropArray[i]]
                            for(let i = 0 ; i < previousMonthResponse.length; i++){
                                const getDate = new Date(previousMonthResponse[i].paidDate).getDate();
                                previousMonthData[getDate] = parseInt(previousMonthData[i].amount.toFixed(2), 10);
                            }
                        }
                    }
                }
                let maxValue = Math.max(...[...currentMonthData, ...previousMonthData])
                if(!maxValue || maxValue === 0){
                    maxValue = 100
                }
                let lineGraphData = {
                    currentMonth: {
                        label: currentMonthLabel,
                        data: currentMonthData
                    },
                    previousMonth: {
                        label: previousMonthLabel,
                        data: previousMonthData
                    },
                    maxValue
                }

                if(lineGraphData.currentMonth.data.length === 0 && lineGraphData.previousMonth.data.length === 0){
                    lineGraphData = null
                }
                // setting lineGraph Data
                dispatch({type:"lineGraphDataSet", payload: lineGraphData})

                // setting loading to false
                dispatch({type:"loading", payload: false})
            }
            catch(error){
    

            }
        }


        getDashboardData();


    }, [])

    /* IO EVENTS */
    useEffect(() => {
        // IO.on('S_NotificationCount', () => {
        //     notification.setNotificationCount(prevCount => prevCount + 1)
        // })
        //S_NotificationDataDashboard // NotifacationData
        socket.on('S_ActivityDataDashboard', data => {
            console.log("Data",data)
            dispatch({type: "S_ActivityDataDashboard", payload: data})
        })

        return () => {
            socket.off("S_ActivityDataDashboard")
        }
    }, [])
    /*END OF IOEVENTS */
    async function getAdditionalActivityData(){
        dispatch({type: "activityLoading", payload: true});

            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/activitysummary?step=${state.stepCount + 1}`, {
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

                dispatch({type: "activityDataSet", payload: responseData})
                dispatch({type: "stepCount"});
                dispatch({type: "activityLoading", payload: false});
            }
            catch(error){
            }
    }

    if(state.loading) return <ComLoader />
    else return (
            <div className = "dashboardContainer">
                <DBanner />
                <div className = "DS_container">
                    <h1>Overview</h1>
                    <DTotalGroups totalGroupsNo = {state.miscData ? state.miscData.totalGroups : ""}/>
                    <DTotalBills totalBillsNo = {state.miscData ? state.miscData.totalBills : ""}/>
                    <DTotalAmount totalBalance = {state.miscData ? state.miscData.totalBalance: ""} />
                </div>
                <div className = "DLineChart_wrapper">
                    <h1>Bill summary</h1>
                    {/* based on weather the bills exist or not and user has data in the bills related to him */}
                    {   (state.miscData && state.miscData.summaryOverlay) ? 
                        <div className = "DLineChart_SummaryOverlay"> 
                            <div className = "DLineWIcon"><MdError/></div>
                            <p className="DLineP">Your pure expenditure excluding the amount you lent</p>
                            <div className ="lineOverlayLegend">
                            <p className = "lineTMnth">This month</p>
                            <p className = "lineLMnth">Last month</p>
                            </div>
                        </div>:
                        <div className = "DLineChart_SummaryOverlay">
                            <div className = "DLineWIcon"><MdError/></div>
                            <p className="DLineP">This is the demo, your data will appear once the bill including you is added by you or your friends</p>
                            <div className ="lineOverlayLegend">
                            <p className = "lineTMnth">This month</p>
                            <p className = "lineLMnth">Last month</p>
                            </div>
                        </div>
                    }
                    <LineChart billsGraphData = {state.lineGraphData ? state.lineGraphData : null}/>
                </div>
                <div className = "DRecentActivity_wrapper">
                    <h1>Recent activities</h1>
                    <DRecentActivity 
                        recentActivitiesInfo = {state.activityData} 
                        loadActivity = {state.loadActivity}
                        getAdditionalActivityData = {getAdditionalActivityData}
                    />
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
            <h2>{props.totalBalance ? +props.totalBalance.toFixed(2): 0}</h2>
            <div className = "DS_IconA">
                <MdAttachMoney />             
            </div>
            <h3>Total balance</h3>
        </div>
    )
}

function DRecentActivity({
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
                <li className = "loadMoreList">
                    <button 
                        disabled = {loadActivity}
                        onClick = {() => {
                                getAdditionalActivityData()
                        }}>{loadActivity ? "loading ..." : "Load More"}</button>
                </li> : 
                null}
        </ul>
    )
}



