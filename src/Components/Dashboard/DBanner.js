import React from "react";
import {useHistory} from "react-router-dom"

export default function DBanner({children, heading, btnText, change, Route}){
    const history = useHistory()
    function RouteHandler(Route){
        history.push(Route)
    }
    return (
        <div className = "DBanner_container">
            <div>
               {children}
            </div>
            {heading && <h3> {heading}</h3>}
            {btnText &&  
            <button 
                className = {change ? "MODIFY_BANNER_BUTTON" : ""}
                disabled = {change ? true : false}
                onClick = {() => {
                    if(!Route){
                        return 
                    }
                    RouteHandler(Route)
                }}
                >{btnText}
            </button>}
        </div>
    )
}
