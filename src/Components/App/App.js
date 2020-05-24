import React, {
    useState, 
    useEffect, 
    createContext, 
    useRef} from 'react'
import TopBar from "./TopBar";
import Leftnav from "./Leftnav";
import Rightnav from "./Rightnav";
import {
    useRouteMatch
} from 'react-router-dom'

import jwt from 'jwt-decode';
import Token from '../../helpers/token'
// importing ServerURIS
import {serverURI} from '../../helpers/GlobalVar'
import io from "socket.io-client";
// REACT_ICONS
import {MdKeyboardArrowRight} from 'react-icons/md';

export const AppUserContext = createContext();
export const socketContext = createContext();
export const notificationContext = createContext();

/* getting userID */
const tokenToDecode = Token.getLocalStorageData('splitzoneToken');
let decode;
let decodedUserID;
if(tokenToDecode){
     decode = jwt(tokenToDecode)
     decodedUserID = decode.userID;
}
const HOST = 'http://localhost:5000';
function App(){
    const socket = io(HOST, {
        'reconnection delay': 800, // defaults to 500
        'reconnection limit': 100, // defaults to Infinity
        'max reconnection attempts': Infinity,
        query: `userID=${decodedUserID}` // defaults to 10
      });
    const [user,setUser] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mblMenuOpen, setMblMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0)
    useEffect(() => {
        async function getUserData(){
            setLoading(true);  // setting loading to true
            const token = Token.getLocalStorageData('splitzoneToken');
            try {
                const response = await fetch(`${serverURI}/api/app/user`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                        } 
                                    })
                if(!response.status === 200){
                    throw new Error('invalid response');
                }
                const userData = await response.json();
                setUser(userData);
                setLoading(false)
                socket.open()
                socket.emit('loggedIn', {userId: userData._id, userEmail: userData.email})
            }
            catch(error){
                setError(error)
                // handle app component loading error
            }
        }

        getUserData();
    
    },[])

    const leftNavMiniButtonRef = useRef(null);
    const {url, path} = useRouteMatch();

    function menuBtnShowHideHandler(e){
        e.preventDefault();
        if(mblMenuOpen){
            setMblMenuOpen(!mblMenuOpen)
            leftNavMiniButtonRef.current.classList.remove("leftNavMiniButtonCHide")
        }else {
            leftNavMiniButtonRef.current.classList.add("leftNavMiniButtonCHide");
            setMblMenuOpen(!mblMenuOpen)
        }
      
    }
    return (
        <div className = "appContainer"> 
            {/* AppUserContextProvider */}
            <AppUserContext.Provider value = { user }>
            <socketContext.Provider value = {socket}>
            <notificationContext.Provider value = {{notificationCount, setNotificationCount}}>
                {/*topNavBar That Contains Logo and UserIcon*/}
                <TopBar/>
                {/*Main side Nav*/}
                <Leftnav 
                    url = {url} 
                    path = {path} 
                    mblOpen = {mblMenuOpen}
                    menuBtnShowHideHandler ={menuBtnShowHideHandler}

                    />
                {/*Mid-Container-DIV rendered from within leftNav*/}
                {/*Right Nav for Ads and offerss*/}
                <Rightnav />  
                <div 
                    className = "leftNavMiniButtonC" 
                    ref = {leftNavMiniButtonRef} 
                    onClick = {menuBtnShowHideHandler}
                    >Menu
                    {/* <MdKeyboardArrowRight/> */}
                </div>
            </notificationContext.Provider>
            </socketContext.Provider>
            </AppUserContext.Provider>
        </div>
    )
}

export default App;
