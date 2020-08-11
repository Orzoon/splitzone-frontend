import React from "react";
import { Doughnut } from 'react-chartjs-2';

export default function PieChart(props){
    const {type} = props;
    // first check

    if(!type){
        return null
    }

    const data = canvas => {
        // TYPE ==="OWE"
        if(type === "OWE"){
            const {totalOwe, totalOwedPaid} = props;
            // console.log("totalOwe", totalOwe)
            // console.log("totalOwedPaid", totalOwedPaid)
            const debitData = totalOwe === 0 ? [50, 10]: // setting dummy data instead of 0
                                totalOwe - totalOwedPaid === 0 ? [totalOwe] 
                                : [totalOwedPaid, totalOwe-totalOwedPaid];
            return {
                //labels: ["Total lent", "Total collected", "to be collected"],
                datasets: [{   
                        labels: totalOwe === 0 ? ["paid", "left"]
                                    :totalOwe - totalOwedPaid === 0 ? "Paid" : ["Paid", "Left"],
                        data:debitData, 
                        backgroundColor: 
                                totalOwe === 0 ? ["#dddd", "#eee"]:
                                totalOwe - totalOwedPaid === 0 ?  "#2DB177": ["#2DB177", "#FFBC21"],
                        borderWidth: 0,
                        //borderColor: ["#2DB177","#EA3C30"],
                        //hoverBackgroundColor:  lentAmount - lentcollectedAmount === 0 ? "#EA3C30": ["#0f4b9b", "#EA3C30"]
                    }]
            } 
        }
        // type === "LENT"
        else{
            const {totalLent, totalLentCollected} = props;
            const lentData = totalLent === 0 ? [80,30]:
                             totalLent - totalLentCollected === 0 ? totalLent 
                                : [totalLentCollected, totalLent-totalLentCollected]   
            return {
                //labels: ["Total lent", "Total collected", "to be collected"],
                datasets: [{   
                        labels: totalLent === 0 ? ["This is for demo purpose only", "This is for demo purpose only"]
                                    :totalLent - totalLentCollected === 0 ? "Received" : ["Received", "Left"],
                        data:lentData, 
                        backgroundColor: 
                                totalLent === 0  ? ["#ddd", "#eee"]:
                                totalLent - totalLentCollected === 0 ?  "#2DB177": ["#2DB177", "#0F4B9B"],
                        borderWidth: 0,
                        //borderColor: ["#2DB177","#EA3C30"],
                        //hoverBackgroundColor:  lentAmount - lentcollectedAmount === 0 ? "#EA3C30": ["#0f4b9b", "#EA3C30"]
                    }]
            } 
        }
    }

    // type OWE
    if(type === "OWE") return(
        <div className = "DPieChart">
            <Doughnut 
                data = {data}
                options = {{
                    responsive: true,
                    maintainAspectRatio:false,
                    cutoutPercentage: 60,
                    elements: {
                        arc: {
                          borderWidth: 0
                        }
                    },
                    tooltips: {
                        enabled: props.totalOwe === 0 ? false : true,
                        callbacks: {
                          label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var index = tooltipItem.index;
                            return dataset.labels[index] + ": " + dataset.data[index];
                          }
                        }
                    },
                    rotation: Math.PI * 20
                }}
            
            />
        </div>
    )
    // End of return"OWE"
    // type LENT
    if(type === "LENT") return(
        <div className = "DPieChart">
            <Doughnut 
                data = {data}
                options = {{
                    responsive: true,
                    maintainAspectRatio:false,
                    cutoutPercentage: 60,
                    elements: {
                        arc: {
                          borderWidth: 0
                        }
                    },
                    tooltips: {
                        enabled: props.totalLent === 0 ? false : true,
                        callbacks: {
                          label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var index = tooltipItem.index;
                            return dataset.labels[index] + ": " + dataset.data[index];
                          }
                        }
                    },
                    rotation: Math.PI * 20
                }}
            
            />
        </div>
    )
}