import React, {useRef} from "react";
import { Line } from 'react-chartjs-2';

/* Token */


export default function LineChart({billsGraphData}){
    const lineBarRef = useRef(null);
    const lineChartRef = useRef(null);
    console.log("billsGraphData", billsGraphData)

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
            labels: billsGraphData ? billsGraphData.currentMonth.label : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
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
                    data: billsGraphData ? billsGraphData.currentMonth.data : [10,20,30,45,60,78,50,65,70,90],
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
                    data: billsGraphData ? billsGraphData.previousMonth.data : [60,90,50,45,68,70,85,70,70,10,60],
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
