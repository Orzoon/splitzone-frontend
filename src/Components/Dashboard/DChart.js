import React, {useState } from "react";
import { Doughnut  } from 'react-chartjs-2';

/* Token */
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token";



export default function DChart(props){
    return(
        <div className = "DDChart_container">
            <Doughnut />
        </div>
    )
}