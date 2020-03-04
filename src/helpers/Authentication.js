import jwt from 'jwt-decode';

import Token from './token';


const Authentication = {
    isLoggedIn: true,
    checkLogIn(){
        localStorage.setItem("splitzoneToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZTBhOTc4NjMzOGEyNTRiMGM0NThmNDIiLCJpYXQiOjE1ODI2NzM0MjN9.QYQfhsBakHZm8ns6zhZixHQNc1O8LhT3_oJ9mKkHBIw")
        const token = Token.getLocalStorageData("splitzoneToken")
        if(!token) return false
        if(!token.trim().length > 0) return false
        try{
            const decode = jwt(token);
            return true
        }catch(error){
            return false
        }
    },
    logOut(){
        Authentication.isLoggedIn = false;
    }
}

export default Authentication;