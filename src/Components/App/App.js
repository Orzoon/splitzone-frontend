import React, {useState, useEffect, createContext} from 'react'
import TopBar from "./TopBar";
import Leftnav from "./Leftnav";
import Rightnav from "./Rightnav";
import {
    useRouteMatch
} from 'react-router-dom'


import Token from '../../helpers/token'
// importing ServerURIS
import {serverURI} from '../../helpers/GlobalVar'

export const AppUserContext = createContext();


function App(){
    const [user,setUser] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            }
            catch(error){
                setError(error)
                console.log(error);
                // redirect user to the login again
            }
        }

        getUserData();
    
    },[])

    const {url, path} = useRouteMatch();

    return (
        <div className = "appContainer"> 
            {/* AppUserContextProvider */}
            <AppUserContext.Provider value = { user }>
                {/*topNavBar That Contains Logo and UserIcon*/}
                <TopBar/>
                {/*Main side Nav*/}
                <Leftnav url = {url} path = {path} />
                {/*Mid-Container-DIV rendered from within leftNav*/}
                {/*Right Nav for Ads and offerss*/}
                <Rightnav />  

            </AppUserContext.Provider>
        </div>
    )
}

export default App;