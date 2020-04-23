import React from 'react';
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
    MdClose
} from 'react-icons/md';
// css Styles
import "../../css/LeftNav.scss";
import "../../css/MidContainer.scss";



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
    const {url,path} = useRouteMatch();
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
                        {/* <NavLink  to ={`${url}/groups`} activeClassName = "leftNavActive">Groups</NavLink> */}
                        <CustomNavLink to = {`${url}/groups`}  linkName = "Groups" activeOnlyWhenExact = {false}>
                            <MdCollectionsBookmark />
                        </CustomNavLink>
                    </li>
                    <li>
                        {/* <NavLink  to ={`${url}/friends`}  activeClassName = "leftNavActive" >Friends</NavLink> */}
                        <CustomNavLink to = {`${url}/friends`}  linkName = "Friends" activeOnlyWhenExact = {true}>
                            <MdGroup/>
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
                </Switch>
            </div>
        </React.Fragment>
       
    )
}



