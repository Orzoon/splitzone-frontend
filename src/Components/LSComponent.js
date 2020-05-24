import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom"
import {useLoginForm, useSignupForm} from "../hooks/appHooks";
import {ReactComponent as GoogleIconSVG} from '../assets/icons/googleicon.svg';
import {ReactComponent as Illustration} from '../assets/illustrationLS.svg';
import jwt from "jwt-decode";
import Token from '../helpers/token';
import {serverURI} from "../helpers/GlobalVar"
/* CSS */
import "../css/Lsc.scss";

const initialLoginValues = {
    email: '',
    password: '',
    emailPlaceholder: "example@gmail.com",
    passwordPlaceholder: "*****",
}

const initialSignupValues = {
    name:'',
    email:'',
    password:'',
    usernamePlaceholder:'username',
    emailPlaceholder: "example@gmail.com",
    passwordPlaceholder: "*********"
}
export default function LSComponent(){
    const history = useHistory();
    const [showForm, setShowForm] = useState('LOGIN');
    const [allSet, setAllSet] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    useEffect(() => {
        async function checkToken(){
            try{
                // checking for token
                const token = Token.getLocalStorageData("splitzoneToken")
                if(!token){
                  throw new Error("no Token")
                }
                const decode = jwt(token);
                if(!decode){
                    localStorage.clear();
                    throw new Error("Invalid token")
                }
                const response = await fetch(`${serverURI}/api/app/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                        } 
                    })
                if(!response.ok){
                    //clear the token 
                    localStorage.clear();
                    throw new Error("Invalid token")
                }
                history.push('/app')
                setCheckingStatus(false)
            }catch(error){
                setCheckingStatus(false)
            }
        }
        checkToken();
    },[])
    function allSetHandler(){
        setAllSet(true);
    }
    function LSFormHandler(FormType){
        setShowForm(FormType)
    }
    return (
        <div className = "main_container">
            <TopBar/>
            <div className = "blue_container blue_container_transition">
            </div> 
            <div className= "white_container white_container_transition">
                <div className="form_container">
                    <div className = "form_Illustration">
                        <Illustration />
                    </div>
                    {/* Actual LOGIN/SIGNUP FORM */}
                    {showForm==="LOGIN" ? 
                        <LoginForm 
                            allSetHandler = {allSetHandler}
                            allSet = {allSet}
                            LSFormHandler = {LSFormHandler}
                            checkingStatus = {checkingStatus}
                        /> :
                        <SignupForm 
                            allSetHandler = {allSetHandler}
                            allSet = {allSet}
                            LSFormHandler = {LSFormHandler}/>
                    }
                </div>
            </div>
        </div>
    )
}

function LoginForm({LSFormHandler, allSetHandler, allSet, checkingStatus}){
    const {
            errors,
            values, 
            loginHandler,
            changeHandler
        } = useLoginForm(initialLoginValues);

    const [loginType, setLoginType] = useState("NONE")
    const TitleData = {
        headingTitle: "Welcome Back :)",
        headingParagraph:"Login and start splitting bills with your friends"
    }
    const SocialData = {
        quick: "Quick Login",
        action: "Register!!",
        name: "LOGIN",
        oppName: "SIGNUP"
    }
    function loginStatusHandler(allSetTF, action){
        if(allSetTF === true){
            allSetHandler()
        }
        setLoginType(action)
    }

    useEffect(() => {
        if(Object.keys(errors).length > 0){
            setLoginType("NONE")
        }
    }, [errors])
    return (
        <div className = "login_form_container">
            <FormHeading  
                headingTitle = {TitleData.headingTitle}
                headingParagraph = {TitleData.headingParagraph}
                allSet = {allSet}
            />
            <form onSubmit = {(e) => {
                    allSetHandler()
                    loginStatusHandler(true, "LOGIN")
                    loginHandler(e, values)}
                } 
                className = "loginForm" 
                style = {{marginTop: Object.keys(errors).length > 0 ? '10px' : '10px'}}
                >
                <input
                    className = {allSet ? "SC_fix":"topFormInputAnimation"}
                    name = "email"
                    value = {values.email}
                    type = "text"
                    placeholder = {values.emailPlaceholder}
                    onChange = {(e) => changeHandler(e)}
                />
                {errors.email && <p>{errors.email}</p>}
                <input
                    className = {allSet ? "SC_fix":"topFormInputAnimation"}
                    name = "password"
                    value = {values.password}
                    type = "password"
                    placeholder = {values.passwordPlaceholder}
                    onChange = {e => changeHandler(e)}
                />
                {errors.password && <p>{errors.password}</p>}
                {errors.message && <p>{errors.message}</p>}
                {checkingStatus && <p style = {{color: "green"}}>checking status</p>}
                <div className = {allSet ? "B_Effect loginBTNFix" :"B_Effect topFormInputAnimation"} >
                    {loginType === "LOGIN" ? 
                        <ButtonLoaderLogin/>
                        :
                        <button 
                        disabled = {(loginType === "GOOGLE") && true}
                        className = "loginButton"
                        type = "submit" 
                        >LOGIN</button>
                    }
                </div>
            </form>
            <SocialLogin 
                loginStatusHandler = {loginStatusHandler}
                loginType = {loginType}
                LSFormHandler = {LSFormHandler}
                SocialData = {SocialData}
                allSet = {allSet}
                allSetHandler = {allSetHandler}
            />
        </div>
    )
}
function SignupForm({LSFormHandler, allSetHandler, allSet}){
    /* NOTE FIX THIS TO DISABLE BUTTONS -NOTE LATERON*/

    const {values, signupHandler, changeHandler, errors} = useSignupForm(initialSignupValues);
    const [signupType, setSignupType] = useState('NONE');
    const TitleData = {
        headingTitle: "Welcome to omnisplit :)",
        headingParagraph:"Create your new account and start splitting bills"
    }
    const SocialData = {
        quick: "Quick Signup",
        action: "SignIn!!",
        name: "signup",
        oppName: "LOGIN"
    }


    function signupStatusHandler(action){
        setSignupType(action)
    }

    useEffect(() => {
        if(Object.keys(errors).length > 0){
            setSignupType("NONE")
        }
    }, [errors])
    return (
        <div className = "signup_form_container">
        <FormHeading
            headingTitle = {TitleData.headingTitle}
            headingParagraph = {TitleData.headingParagraph}
            allSet = {allSet}
        />
        <form
            onSubmit = {e => {
                allSetHandler()
                signupStatusHandler("SIGNUP")
                signupHandler(e, values)
            }}
            className = "signupForm" 
            style = {{marginTop: Object.keys(errors).length > 0 ? '10px' : '10px'}}
        > 
            <input
                className = "SC_fix"
                name = "name"
                type = "text"
                placeholder = {values.usernamePlaceholder}
                onChange = {e => changeHandler(e)}
            />
            {errors.name && <p>{errors.name}</p>}
            <input
                className = "SC_fix"
                name = "email"
                type = "email"
                placeholder = {values.emailPlaceholder}
                onChange = {e => changeHandler(e)}
            />
            {errors.email && <p>{errors.email}</p>}
            <input
                className = "SC_fix"
                name = "password"
                type = "password"
                placeholder = {values.passwordPlaceholder}
                onChange = {e => changeHandler(e)}
            />
            {errors.password && <p>{errors.password}</p>}
            {errors.message && <p>{errors.message}</p>}
            <div className = "B_Effect SC_fix">
                {signupType === "SIGNUP" ? 
                    <ButtonLoaderLogin/>
                    :
                    <button 
                    disabled = {(signupType === "GOOGLE") && true}
                    className = "loginButton"
                    type = "submit"
                    >SIGNUP</button>
                }
            </div>
        </form>

        {/* SOCIAL BARE COMPONENT AVOIDING MULTIPLE CHECKS */}
        <div className = "social_login_container">
            <h1 className = {allSet ? "SC_fix MarginFix" :"bottomFormAnimation"}>{SocialData.quick}</h1>
            {signupType ==="GOOGLE" ? 
                <ButtonLoaderGoogle/>
                :
                <button 
                    onClick = {e => signupStatusHandler("GOOGLE")}
                    className = {allSet ? "SC_fix MarginFix" :"bottomFormAnimation"}
                    disabled = {(signupType ==="LOGIN") && true }
                    >
                    <a href = "http://localhost:5000/auth/google">
                        <span>Google</span>
                        <GoogleIconSVG/>
                    </a>
                </button>
            }
            <h3 
                className ={allSet ? "SC_fix MarginFix" :"bottomFormAnimation"}
                onClick = {e => {
                    allSetHandler()
                    LSFormHandler(SocialData.oppName)
                }}
            >
                {SocialData.action}
            </h3>
        </div>
    </div>
    )
}
function FormHeading({headingTitle, headingParagraph, allSet}){
    return (
        <div className = {allSet ? "formHeading SC_fix": "formHeading"}>
            <h1 className = {allSet ? "SC_fix MarginFix": "topFormHeadAnimation"}>{headingTitle}</h1>
            <p className = {allSet ? "SC_fix MarginFix": "topFormHeadAnimation"} >{headingParagraph}</p>
        </div>
    )
}
function SocialLogin({loginStatusHandler, loginType, LSFormHandler, SocialData, allSet,allSetHandler}){
    return(
        <div className = "social_login_container">
            <h1 className ={allSet ? "SC_fix MarginFix": "bottomFormAnimation"}>{SocialData.quick}</h1>
            {loginType ==="GOOGLE" ? 
                <ButtonLoaderGoogle/>
                :
                <button 
                    onClick = {e => loginStatusHandler(true, "GOOGLE")}
                    className = {allSet ? "SC_fix MarginFix": "bottomFormAnimation"}
                    disabled = {(loginType ==="LOGIN") && true }
                    >
                    <a href = "http://localhost:5000/auth/google">
                        <span>Google</span>
                        <GoogleIconSVG/>
                    </a>
                </button>
            }
            <h3 
                className = {allSet ? "SC_fix MarginFix": "bottomFormAnimation"}
                onClick = {e => {allSetHandler(); LSFormHandler(SocialData.oppName)}}
            >
                {SocialData.action}
            </h3>
        </div>
    )
}
/* Function TOPBARLS */
function TopBar(){
    return (
        <div className = "top_bar_container">
            <div className = "text_logo_container">
                <h1 className = "LOGO_TEXT">SplitZone</h1>
                <p className = "LOGO_PARA">Bill Splitting Demo</p>
            </div>
        </div>
    )
}
// LOADER COMPONENTS
function ButtonLoaderLogin(){
  return(
    <button className = "loaderButton Btn_login">
        <div className = "l_circle"></div>
        <div className = "l_circle"></div>
        <div className = "l_circle"></div>
    </button>
  )  
}

function ButtonLoaderGoogle(){
    return(
      <button className = "loaderButton Btn_google">
          <div className = "l_circle C_first"></div>
          <div className = "l_circle C_second"></div>
          <div className = "l_circle C_third"></div>
      </button>
    )  
}