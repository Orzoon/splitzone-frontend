import React, {useState } from "react";
import { Pie } from 'react-chartjs-2';

/* Token */
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token";



export default function PieChart(props){
    return(
        <div className = "DPieChart_container">
            <Pie />
        </div>
    )
}