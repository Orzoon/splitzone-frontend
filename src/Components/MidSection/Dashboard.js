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
    return (
        <div className = "dashboardContainer">
            <DBanner />
            <DTotalGroups />
            <DTotalBills />
            <DTotalAmount />
            <LineChart />
            <PieChart />
            <DChart />
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



