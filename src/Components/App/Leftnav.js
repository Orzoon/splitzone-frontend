import React, {useState, createContext} from 'react';
import {useHistory} from 'react-router-dom';
import 
{   
    Route,
    Switch,
    useRouteMatch,
    Redirect,
    Link
} from 'react-router-dom'

/* MID CONTAINER COMPONENTS */
import Dashboard from '../MidSection/Dashboard';
import Friends from '../MidSection/Friends';
import FriendsV2 from "../MidSectionV2/FriendsV2";
import GroupsV2 from "../MidSectionV2/GroupsV2";
import Groups from '../MidSection/Groups';
import Bills from '../MidSection/Bills';
import News from '../MidSection/News';
import Profile from '../MidSection/Profile';

// Icon context
import {IconContext} from 'react-icons';
// IMPORTING ICONS
import {
    MdDashboard, 
    MdGroup, 
    MdCollectionsBookmark,
    MdPerson, 
    MdLibraryBooks,
    MdClose,
    MdExitToApp
} from 'react-icons/md';
import {LoaderButton} from "../UIC/UIC";
import {serverURI} from '../../helpers/GlobalVar';
import Token from '../../helpers/token';
// css Styles
import "../../css/LeftNav.scss";
import "../../css/MidContainer.scss";

export const LogOutprocessContext = createContext();

function CustomNavLink({activeOnlyWhenExact, to, linkName, children}){
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    })
    return (<Link to = {to} className = {match ? "leftNavActive": ""}>
            <IconContext.Provider value = {{
               className: `${match ? "leftNavIconsActive" : "leftNavIcons "}`
            }}>
                {children}

            </IconContext.Provider>
            {linkName}
            </Link>)
}

export default function LeftNaV(props) {
    const history = useHistory();
    const {url,path} = useRouteMatch();
    const [logOutprocess, setLogOutProcess] = useState(false);
    const [tryAgain, setTryAgain] = useState(false);

    async function handleLogout(){
        setLogOutProcess(true);
        try{
            const token = Token.getLocalStorageData('splitzoneToken');
            const response = await fetch(`${serverURI}/api/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    } 
                })

            if(!response.status === 200){
                throw Error("something went wrong while logging out try again later")
            }
            // successfull delete all tokens
            setLogOutProcess(true);
            localStorage.clear();
            history.push('/');
            //Back to mainpage later on
            // redirecting
            
        }catch(e){
            setLogOutProcess(false);
            setTryAgain(true);
            tryAgainHandler();
        }
    }

    async function tryAgainHandler(){
        if(tryAgain){
            setTimeout(() => {
                setLogOutProcess(false);
                setTryAgain(false)
            }, 800)
        }
    }
    return (
        <React.Fragment>
             <div className = {props.mblOpen ? "leftNavContainer leftNavContainerOpen" : "leftNavContainer leftNavContainerClose"}>
                <ul>
                    <li>
                        {/* <NavLink  to ={`${url}/dashboard`} activeClassName = "leftNavActive">Dashboard</NavLink> */}
                        <CustomNavLink to = {`${url}/dashboard`}  linkName = "Dashboard" activeOnlyWhenExact = {true}>
                            <MdDashboard />
                        </CustomNavLink>
                    </li>
                    <li>
                        {/* <NavLink  to ={`${url}/friends`}  activeClassName = "leftNavActive" >Friends</NavLink> */}
                        <CustomNavLink to = {`${url}/friends`}  linkName = "Friends" activeOnlyWhenExact = {true}>
                            <MdGroup/>
                        </CustomNavLink>
                    </li>
                    <li>
                        {/* <NavLink  to ={`${url}/groups`} activeClassName = "leftNavActive">Groups</NavLink> */}
                        <CustomNavLink to = {`${url}/groups`}  linkName = "Groups" activeOnlyWhenExact = {false}>
                            <MdCollectionsBookmark />
                        </CustomNavLink>
                    </li>
                    <li>
                        {/* <NavLink to ={`${url}/news`}  activeClassName = "leftNavActive">News</NavLink> */}
                        <CustomNavLink to = {`${url}/news`}  linkName = "News" activeOnlyWhenExact = {true}>
                            <MdLibraryBooks/>
                         </CustomNavLink>
                    </li>
                    <li>
                        {/* <NavLink  to ={`${url}/profile`} activeClassName = "leftNavActive">Profile</NavLink> */}
                        <CustomNavLink to = {`${url}/profile`}  linkName = "Profile" activeOnlyWhenExact = {true}>
                            <MdPerson/>
                        </CustomNavLink>
                    </li>

                    {/* friends version2 */}
                    <li>
                        <CustomNavLink to = {`${url}/friendsV2`}  linkName = "friendsV2" activeOnlyWhenExact = {false}>
                            <MdCollectionsBookmark />
                        </CustomNavLink>
                    </li>
                    <li>
                        <CustomNavLink to = {`${url}/groupsV2`}  linkName = "groupsV2" activeOnlyWhenExact = {false}>
                            <MdCollectionsBookmark />
                        </CustomNavLink>
                    </li>
                    <li className = "navLogout">
                        {logOutprocess ? <LoaderButton fix = "LogOutButtonFIX" color = "Button_Blue_color"/> : 
                            <button onClick = {handleLogout}>
                                {tryAgain ? "Try again": "Logout"}
                            </button>
                        }
                    </li>
                </ul>
                <div 
                    className = {props.mblOpen ? "leftNavCloseBtnC leftNavCloseBtnCOpen" : "leftNavCloseBtnC leftNavCloseBtnCClose"}
                    onClick = {e => props.menuBtnShowHideHandler(e)}
                    >
                     <MdClose />
                </div>
            </div>
            {/* MID CONTAINER*/}
            <div className = "midContainer">
                    <Switch>
                        <Route exact path = {path}>
                            <Redirect to = {{
                                pathname: `${path}/dashboard`
                            }}/>
                        </Route>
                        <Route path = {`${path}/dashboard`} component = {Dashboard} />

                        {/* GROUPS ROUTES */}
                        <Route path =  {`${path}/groups/:groupID`} component = {Bills} />
                        <Route path =  {`${path}/groups`} component = {Groups} />

                        <Route path =  {`${path}/friends`} component = {Friends} />
                        <Route path =  {`${path}/profile`} component = {Profile} />
                        <Route path =  {`${path}/news`} component = {News}/>  
                        <Route path = {`${path}/friendsV2`} component = {FriendsV2} />
                        <Route path = {`${path}/groupsV2`} component = {GroupsV2} />
                    </Switch>
            </div>
        </React.Fragment>
       
    )
}



