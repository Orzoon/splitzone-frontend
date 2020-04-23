import React, {useEffect, useState, } from "react";
import { useHistory } from 'react-router-dom'

/* TOKEN */
import {serverURI} from "../helpers/GlobalVar";

function useLoginForm(initialValues){
    const history = useHistory();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [loading, setIsLoading] = useState(false);

    function changeHandler(e){
        const {name, value} = e.target;
        setValues({...values, [name] : value})
    }

    function validationCheck(values){
        let errorObj ={}
        if (!values.email) {
            errorObj.email = 'Email is required';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errorObj.email = 'Invalid email address';
          }
        if(!values.password){
            errorObj.password = 'Password is required';
        }else if(values.password.trim().length < 7){
            errorObj.password = "Password length must be at least 7 character"
        }
        return errorObj;
    }

    function loginHandler(e,val){
        console.log("val",val)
        e.preventDefault();
        const validationErrors = validationCheck(val);
        // NOTE // SET eRRORS IF ANY ERRORS
        if(Object.keys(validationErrors).length > 0 ){
            return 
        }

        //send the values to the server
        async function makeLoginRequest(val){
            try{
                const response = await fetch(`${serverURI}/api/user/signin`, {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(val)
                                })
                if(!response.status === 200){
                    if(response.status === 422){
                        throw new Error(await response.json())
                    }else {
                        throw new Error("someting went wring")
                    }
                }
                

                // userInformation
                let responseData = await response.json();
                console.log("responseData", responseData)
                localStorage.setItem("splitzoneToken", responseData.token)
                history.push("/app");
                
            }catch(error){
                // catch for serverSideErrors
                console.log("loginError", error)
            }
        }

        makeLoginRequest(val);
    }

    return {values, loginHandler, changeHandler}
}

export {
    useLoginForm
}