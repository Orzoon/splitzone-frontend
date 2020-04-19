import React from "react";
import {useLoginForm} from "../hooks/appHooks";


/* Token */
import {serverURI} from "../helpers/GlobalVar";
import Token from "../helpers/token";

/* CSS */
import "../css/Lsc.scss";

const initialLoginValues = {
    email: '',
    password: '',
    emailPlaceholder: "example@gmail.com",
    passwordPlaceholder: "*****"
}
export default function LSComponent(){
    return (
        <div className = "LSC_container">
            <LoginForm />
            <SignupForm />
        </div>
    )
}


function LoginForm(){
    const {
            values, 
            loginHandler,
            changeHandler
        } = useLoginForm(initialLoginValues);
    return (
        <div className = "LSL_container">
            <form onSubmit = {(e) => loginHandler(e, values)}>
                <input
                    name = "email"
                    value = {values.email}
                    type = "email"
                    placeholder = {values.emailPlaceholder}
                    onChange = {(e) => changeHandler(e)}
                />
                <br/>
                <input
                    name = "password"
                    value = {values.password}
                    type = "password"
                    placeholder = {values.passwordPlaceholder}
                    onChange = {e => changeHandler(e)}
                />
                <br />
                <input 
                    type = "submit" 
                    value = "Login"
                />
            </form>
            <button>
                <a href = "http://localhost:5000/auth/google">
                    LOGIN WITH GOOGLE
                </a>
            </button>
        </div>
    )
}

function SignupForm(){
    return (
        <div className = "LSS_container">
            
        </div>
    )
}