import React, {useState} from "react";
import {useLoginForm} from "../hooks/appHooks";
import {ReactComponent as GoogleIconSVG} from '../assets/icons/googleicon.svg';

/* Token */

/* CSS */
import "../css/Lsc.scss";

const initialLoginValues = {
    email: '',
    password: '',
    emailPlaceholder: "example@gmail.com",
    passwordPlaceholder: "*****"
}
export default function LSComponent(){
    localStorage.clear();
    const [stop, setStop] = useState(false);
    const [showForm, setShowForm] = useState('login');


    if(stop) return (
        <div className = "LSC_container">
            <LoginForm />
            <SignupForm />
        </div>
    )
    else return (
        <div className = "main_container">
            <div className = "blue_container blue_container_transition">
                <div className= "white_container white_container_transition">
                    <div className="form_container">
                        <div className = "form_Illustration">
                        </div>

                        {/* Actual LOGIN/SIGNUP FORM */}
                        {showForm==="login" ? 
                            <LoginForm /> :
                            <SignupForm/>
                        }
                    </div>
                </div>
            </div> 
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
        <div className = "login_form_container">
            <FormHeading/>
            <form onSubmit = {(e) => loginHandler(e, values)} className = "loginForm">
                <input
                    name = "email"
                    value = {values.email}
                    type = "email"
                    placeholder = {values.emailPlaceholder}
                    onChange = {(e) => changeHandler(e)}
                />
    
                <input
                    name = "password"
                    value = {values.password}
                    type = "password"
                    placeholder = {values.passwordPlaceholder}
                    onChange = {e => changeHandler(e)}
                />

                <div className = "B_Effect">
                    <button 
                        className = "loginButton"
                        type = "submit" 
                    >LOGIN</button>
                </div>
            </form>
            <SocialLogin/>
        </div>
    )
}

function SignupForm(){
    return (
        <div className = "LSS_container">
            
        </div>
    )
}


function FormHeading(){
    return (
        <div className = "formHeading">
            <h1>Welcome Back :)</h1>
            <p>Some sub heading describing something</p>
        </div>
    )
}


function SocialLogin(){
    return(
        <div className = "social_login_container">
            <button>
                <a href = "http://localhost:5000/auth/google">
                    <span>Google</span>
                    <GoogleIconSVG/>
                </a>
            </button>
        </div>
    )
}