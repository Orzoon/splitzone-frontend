import React, {useEffect, useContext, useReducer} from 'react';

import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
/* D_Components Imports */
import ComLoader from "./ComLoader";
import DBanner from "../Dashboard/DBanner";
import PieChart from "../Dashboard/PieChart";
import LineChart from "../Dashboard/LineChart";
import DRecentActivity from "../Dashboard/DRecentActivity";
import {socketContext, notificationContext} from "../App/App";

import {MdError} from "react-icons/md";
// scss style
import "../../css/Dashboard.scss";

// ICONS  DS
import {MdReceipt,MdAttachMoney,MdCollectionsBookmark} from 'react-icons/md';
import {ReactComponent as BannerFirst} from "../../assets/BannerFirst.svg";

/* DASHBOARD REDUCER */
function DashboardReducer(state, action){
    switch(action.type){
        case "miscDataSet":
            return {...state, miscData: action.payload}
        
        case "lineGraphDataSet":
            return {...state, lineGraphData: action.payload}

        case "pieChartData":
                return {...state, pieChartData: action.payload}

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
    /*Pie ChartInitialData NOTE pieChartData received from same endpoint */
    pieChartData: null,
    activityData: null,
    loading: true,
    stepCount: 1,
    loadActivity: false,
    bannerHeading: "This is your dashboard, from here you can get overall overview of your expenditure.",
    btnText: "get started",
    Route: "/app/friends"
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
                
                /* grabbing pieChartData from lineChartResponseData */
                const pieChartData = lineChartResponseData["pieData"];
                // attaching dummy data to pieChartData 
                pieChartData.totalLentCollected = 0;
                pieChartData.totalOwedPaid = 0;
                // pieChartData.totalOwe = 20;

                //pieChartData.totalOwe = 50;
                /* deleting pieChartData from the lineChartData */
                delete lineChartResponseData.pieData;
              
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

                // setting pieChartData
                dispatch({type:"pieChartData", payload: pieChartData})
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
                setTimeout(() => {
                    dispatch({type: "activityLoading", payload: false});
                }, 400);
            }
            catch(error){
            }
    }
    if(state.loading) return <ComLoader />
    else return (
            <div className = "dashboardContainer">
                <DBanner 
                    heading = {state.bannerHeading ? state.bannerHeading: " "}
                    btnText = {state.btnText ? state.btnText : " "}
                    Route = {state.Route ? state.Route: null}
                    >
                <BannerFirst/>
                </DBanner>
                <div className = "DS_container">
                    <h1>Overview</h1>
                    <DTotalGroups totalGroupsNo = {state.miscData ? state.miscData.totalGroups : ""}/>
                    <DTotalBills totalBillsNo = {state.miscData ? state.miscData.totalBills : ""}/>
                    <DTotalAmount totalBalance = {state.miscData ? state.miscData.totalBalance: ""} />
                </div>
                {/* LineChart wrapper contains all lineChart and pieCharts */}
                <div className = "DLineChart_wrapper">
                    <h1>Bill summary</h1>

                    <div className = "DPieChart_Container DPieChart_Container_first">  
                        <h1>Debit reports</h1> 
                        <PieChart 
                            type = {state.pieChartData ? "OWE" : null}
                            totalOwe = {state.pieChartData ? state.pieChartData.totalOwe : null}
                            totalOwedPaid = {state.pieChartData ? state.pieChartData.totalOwedPaid : null}
                        />
                        <ul className = "PieBtm_information"> 
                            <li>
                                <h1 className = "pieB_h1">Total debt</h1> 
                                <p>{state.pieChartData ? state.pieChartData.totalOwe : ""}</p>
                            </li>
                            <li>
                                <h1 className = "pieB_h1">Paid</h1> 
                                <p>{state.pieChartData ? state.pieChartData.totalOwedPaid : ""}</p>
                            </li>
                            <li>
                                <h1 className = "pieB_h1">Left</h1> 
                                <p>{state.pieChartData ? state.pieChartData.totalOwe - state.pieChartData.totalOwedPaid : ""}</p>
                            </li>
                        </ul>
                    </div>
 
 
                    <div className = "DPieChart_Container DPieChart_Container_second">  
                        <h1>Credit reports</h1> 
                        <PieChart 
                            type = {state.pieChartData ? "LENT" : null}
                            totalLent = {state.pieChartData ? state.pieChartData.totalLent : null}
                            totalLentCollected = {state.pieChartData ? state.pieChartData.totalLentCollected : null}
                        />
                        <ul className = "PieBtm_information"> 
                            <li>
                                <h1 className = "pieB_h1">Total Lent</h1> 
                                <p>{state.pieChartData ? state.pieChartData.totalLent : ""}</p>
                            </li>
                            <li>
                                <h1 className = "pieB_h1">Received</h1> 
                                <p>{state.pieChartData ? state.pieChartData.totalLentCollected : ""}</p>
                            </li>
                            <li>
                                <h1 className = "pieB_h1">Left</h1> 
                                <p>{state.pieChartData ? state.pieChartData.totalLent - state.pieChartData.totalLentCollected: ""}</p>
                            </li>
                        </ul>
                    </div>

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





