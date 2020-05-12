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


import Token from '../../helpers/token'
// importing ServerURIS
import {serverURI} from '../../helpers/GlobalVar'

// REACT_ICONS
import {MdKeyboardArrowRight} from 'react-icons/md';

export const AppUserContext = createContext();

function App(){
    const [user,setUser] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mblMenuOpen, setMblMenuOpen] = useState(false);

    useEffect(() => {
        async function getUserData(){
            setLoading(true);  // setting loading to true
            const token = Token.getLocalStorageData('splitzoneToken');
            console.log(token);
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
                console.log(response.status)
                const userData = await response.json();
                console.log("userData", userData)
                setUser(userData);
                setLoading(false)
            }
            catch(error){
                setError(error)
                console.log(error);
                // redirect user to the login again
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
            </AppUserContext.Provider>
        </div>
    )
}

export default App;
