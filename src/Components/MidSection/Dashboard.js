import React, {useEffect} from 'react';

import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
/* D_Components Imports */
import DBanner from "../Dashboard/DBanner";
import LineChart from "../Dashboard/LineChart";
import DChart from "../Dashboard/DChart";
import PieChart from "../Dashboard/PieChart";
// scss style
import "../../css/Dashboard.scss";

export default function Dashboard(props){
    useEffect(() => {
        async function test(){
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
                console.log("groupCount",responseData)
            }
            catch(error){
    
            }
        }

        test();
    })

    function handleFacebookLogin(e){
        e.preventDefault();

       const testFetch = fetch("http://localhost:5000/auth/facebook",{
           method: "GET"
       })
    }
    return (
        <div className = "dashboardContainer">
            <DBanner />
            <div className = "DS_container">
                <DTotalGroups />
                <DTotalBills />
                <DTotalAmount />
            </div>
            <LineChart />
            <div className = "DDP_container">
                <PieChart />
                <DChart />
            </div>
            <DRecentActivity />
        </div>
    )
}

/* MISC_Components */

function DTotalBills(props){
    return (
        <div className = "DTotalBills">
            DtotalBills
        </div>
    )
}

function DTotalGroups(props){
    return (
        <div className = "DTotalGroups">
            totalGroups
        </div>
    )
}

function DTotalAmount(props){
    return (
        <div className = "DTotalAmount">
            totalAmount
        </div>
    )
}

function DRecentActivity(props){
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
                console.log("activity",responseData)
            }
            catch(error){
    
            }
        }

        test();
    })
    return (
        <div className = "DRecentActivity">
          DRecentActivity
        </div>
    )
}



