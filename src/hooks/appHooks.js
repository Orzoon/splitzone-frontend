import {useState} from "react";
import { useHistory } from 'react-router-dom'

/* TOKEN */
import {serverURI} from "../helpers/GlobalVar";

function useLoginForm(initialValues){
    const history = useHistory();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    function changeHandler(e){
        const {name, value} = e.target;
        setValues({...values, [name] : value})
    }

    function validationCheck(values){
        /* SERVER SIDE CHECK ACTIVE */
        let errorObj ={}
        // if (!values.email) {
        //     errorObj.email = 'Email is required';
        //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        //     errorObj.email = 'Invalid email address';
        //   }
        // if(!values.password){
        //     errorObj.password = 'Password is required';
        // }else if(values.password.trim().length < 7){
        //     errorObj.password = "Password length must be at least 7 character"
        // }
        return errorObj;
    }

    function loginHandler(e,val){
        e.preventDefault();
        const validationErrors = validationCheck(val);
        // NOTE // SET eRRORS IF ANY ERRORS
        if(Object.keys(validationErrors).length > 0 ){
            setErrors(validationErrors)
            return 
        }
        setErrors({})
        const data = {
            email: val.email,
            password: val.password
        }
        //send the values to the server
        async function makeLoginRequest(val){
            try{
                const response = await fetch(`${serverURI}/api/user/signin`, {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data)
                                })
                // if success Status
                if(!response.ok){
                    const errorDta = await response.json();
                    throw (errorDta)
                }
                
                let responseData = await response.json();
                /* later as cookie while adding refresh token */
                localStorage.setItem("splitzoneToken", responseData.token)
                /* Later to protected ServerRoute with token */
                history.push("/app");
                
            }catch(error){
                let errorObj = {};
                // catch for serverSideErrors
                if(error.statusCode === 400 && error.hasOwnProperty('message') && Array.isArray(error.message)){
                            const messageArray = error.message;
                            messageArray.forEach(message => errorObj[message.param] = message.msg)
                }
                else if(error.statusCode === 400 || error.status === 400) {
                        errorObj.message = error.message
                }
                else if (error.status === 500){
                    errorObj.message = error.message
                    }
                else{
                    errorObj.message = "Something went wrong try again later"
                }
                setErrors(errorObj)
            }
        }

        makeLoginRequest(val);
    }

    return {values, loginHandler, changeHandler, errors}
}

function useSignupForm(initialValues){
    const history = useHistory();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    function changeHandler(e){
        const {name, value} = e.target;
        setValues({...values, [name] : value})
    }
    function validationCheck(values){
        /* SERVER SIDE ACTIVE */
        let errorObj ={}
        // client side validation
        // if(!values.name){
        //     errorObj.name = "Username cannot be empty";
        // }else if (values.name.trim().length< 4){
        //     errorObj.name = "Username should not be less than 4 characters";
        // }
        // if (!values.email) {
        //     errorObj.email = 'Email is required';
        //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        //     errorObj.email = 'Invalid email address';
        //   }
        // if(!values.password){
        //     errorObj.password = 'Password is required';
        // }else if(values.password.trim().length < 7){
        //     errorObj.password = "Password length must be at least 7 character"
        // }
        return errorObj;
    }
    function signupHandler(e,val){
        e.preventDefault();
        const validationErrors = validationCheck(val);
        // NOTE // SET eRRORS IF ANY ERRORS
        if(Object.keys(validationErrors).length > 0 ){
            setErrors(validationErrors)
            return 
        }
        setErrors({})
        const data = {
            name: val.name,
            email: val.email,
            password: val.password
        }

        //send the values to the server
        async function makeSignupRequest(val){
            try{
                const response = await fetch(`${serverURI}/api/user/signup`, {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data)
                                })
        
                if(!response.ok){
                    const errorDta = await response.json();
                    throw (errorDta)
                }

                // userInformation
                let responseData = await response.json();
                /* later as cookie while adding refresh token */
                localStorage.setItem("splitzoneToken", responseData.token)
                /* Later to protected ServerRoute with token */
                history.push("/app");
                
            }catch(error){
                let errorObj = {};
                console.log("this is the error", error)
                // catch for serverSideErrors
                if(error.statusCode === 400 && error.hasOwnProperty('message') && Array.isArray(error.message)){
                            const messageArray = error.message;
                            messageArray.forEach(message => errorObj[message.param] = message.msg)
                }
                else if(error.statusCode === 400 || error.status === 400) {
                        errorObj.message = error.message
                }
                else if (error.status === 500){
                    errorObj.message = error.message
                    }
                else{
                    errorObj.message = "Something went wrong try again later"
                }
                setErrors(errorObj)
                return
            }
        }
        makeSignupRequest(val);
    }
    return {values, signupHandler, changeHandler, errors}
}

export {
    useLoginForm,
    useSignupForm
}