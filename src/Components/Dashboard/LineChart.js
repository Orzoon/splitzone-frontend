import React, {useState, useEffect, useRef, useContext } from "react";
import { Line } from 'react-chartjs-2';

/* Token */
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token";

export default function LineChart(props){
    const lineBarRef = useRef(null);
    const [billsGraphData, setBillsGraphData] = useState(null);
    const lineChartRef = useRef(null);
    useEffect(() => {
        async function test(){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/summary?currentMonth=currentMongth`, {
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
                console.log(responseData)
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
                const lineGraphData = {
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
                console.log(lineGraphData)
                // setting lineGraph Data
                setBillsGraphData(lineGraphData)

            }catch(error){

            }
        }
        test();
    }, [])


    const data = canvas => {
        const ctx = canvas.getContext("2d")
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        // gradient.addColorStop(0, "#7C4DFF");
        // gradient.addColorStop(1, "#448AFF");
        //gradient.addColorStop(1, "#00BCD4");
        //gradient.addColorStop(1, "#1DE9B6");
        //  gradient.addColorStop(0, "#32d6fb");
        //  gradient.addColorStop(1, "#5558ed");
        // 32d6fb  5558ed 
        gradient.addColorStop(0, "rgb(68, 138, 255)");
        gradient.addColorStop(1, "rgb(15, 75, 155)");
        var gradientFill = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientFill.addColorStop(0, "rgba(15, 76, 155, 0.5)");
        gradientFill.addColorStop(0.7, "rgba(15, 76, 155, 0)");
        // gradientFill.addColorStop(0.6, "rgba(0, 188, 212, .8)");
        // gradientFill.addColorStop(1, "rgba(29, 233, 182, .8)");

        var gradientFillLast = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientFillLast.addColorStop(0, "rgba(192, 191, 191,0.5)");
        gradientFillLast.addColorStop(0.7, "rgba(192, 191, 191, 0)");
        return   {
            labels: billsGraphData ? billsGraphData.currentMonth.label : [],
            datasets: [
                {   
                    label: "This Month",
                    //borderColor: gradient,
                    borderColor: gradient,
                    radius: 2,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: gradient,
                    borderWidth: 5,
                    fill: true,
                    backgroundColor: gradientFill,
                    data: billsGraphData ? billsGraphData.currentMonth.data : [],
                    //backgroundColor: "#fff"
                },
                {   
                    label: "Last Month",
                    //borderColor: gradient,
                    borderColor: "rgb(192, 191, 191)",
                    radius: 2,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "rgb(192, 191, 191)",
                    borderWidth: 5,
                    fill: true,
                    backgroundColor: gradientFillLast,
                    data: billsGraphData ? billsGraphData.previousMonth.data : [],
                    //backgroundColor: "#fff"
                }
            ]
        }
    }
    return (
        <div className = "DLineChart_container" ref = {lineChartRef}>

            <Line ref = {lineBarRef}
                data = {data}
                options = {{
                    responsive: true,
                    maintainAspectRatio:false,
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    },
                    hover: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        xAxes: [{
                                gridLines : {
                                    display : false
                                },
                                ticks: {
                                    beginAtZero:true,
                                    autoSkip: true,
                                    maxTicksLimit: 1,
                                    maxRotation: 0,
                                    minRotation: 0
                                }
                            }],
                        yAxes: [{
                            gridLines : {
                                drawBorder : false
                            },
                            ticks: {
                                beginAtZero:true,
                                min: 0,
                                max: billsGraphData ? billsGraphData.maxValue : 100,
                                padding: 5,
                                stepSize: billsGraphData ? billsGraphData/6 : 100/6
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }}
            />
        </div>
    )
}
