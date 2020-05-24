import jwt from 'jwt-decode';

import Token from './token';


const Authentication = {
    checkLogIn(){
        const token = Token.getLocalStorageData("splitzoneToken")
        if(!token) return false
        if(!token.trim().length > 0) return false
        try{
            const decode = jwt(token);
            if(!decode){
                return false
            }
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