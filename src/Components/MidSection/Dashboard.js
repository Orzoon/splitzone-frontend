import React from 'react';


/* D_Components Imports */
import DBanner from "../Dashboard/DBanner";
import LineChart from "../Dashboard/LineChart"
// scss style
import "../../css/Dashboard.scss";

export default function Dashboard(props){
    return (
        <div className = "dashboardContainer">
           <DBanner />
           <LineChart />
        </div>
    )
}