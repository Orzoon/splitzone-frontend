import React, {useState, useEffect, useRef, useReducer} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {serverURI} from "../../helpers/GlobalVar"
import Token from "../../helpers/token"
import DBanner from "../Dashboard/DBanner";
import ComLoader from "./ComLoader";
// icons
import {MdAddCircleOutline} from "react-icons/md";

import "../../css/Groups.scss";

/*************
 *
 * MAIN GROUP COMPONENT 
 * 
 *************/

const groupReducer = function (state, action){
    switch(action.type){
        case "setLoadingB":
            return {...state, loading: action.payload}
        case "setGroupsData": 
            return {...state, groupsData: action.payload}
        case "setCreateGroupB":
            return {...state, createGroup: action.payload}
        case "setError": 
            return {...state, createGroupError:action.payload}
        case "loadingButtonCreateGroup":
            return {...state, loadingButtonCreateGroup: action.payload}
        default: 
            return state;
    }
}

const initialGroupState = {
    loading: true,
    errors: null,
    groupsData: null,
    createGroup: false,
    createGroupError: null,
    loadingButtonCreateGroup: false
}
export default function Groups(){
    const [state, dispatch] = useReducer(groupReducer, initialGroupState);

    const {url} = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
        async function getGroups(){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/groups`, {
                                    method: "GET",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '+ token
                                    }
                                })
                if(!response.status === 200){
                    // check for other status code and set errors accordingly
                    throw Error ("something went wrong")
                }
                const data = await response.json();

                dispatch({type: "setGroupsData", payload: data})
                dispatch({type: "setLoadingB", payload: false})

            }catch(error){
              // error dispatch
            }
        }
        getGroups();
    }, [])

    function ToBills(groupID){
        history.push(url + "/" + groupID);
    }

    function createGroupClickHandler(){
       dispatch({type: "setCreateGroupB", payload: !state.createGroup})

       // removing previously set Errors open component mount
       if(state.createGroup){
        dispatch({type: "setError", payload: null})
       }
    }

    async function createGroupHandler(e, groupName){
        dispatch({type: "loadingButtonCreateGroup", payload: true})
        e.preventDefault();
        if(!groupName || groupName.trim().length <= 0){
            dispatch({type: "setError", payload: "Empty group name"})
            dispatch({type: "loadingButtonCreateGroup", payload: false})
            return null
        }

        if(groupName && groupName.trim().length > 15){
            dispatch({type: "setError", payload: "Group name should be no more than 15 characters"})
            dispatch({type: "loadingButtonCreateGroup", payload: false})

            return null
        }

        const groupData = {
            groupName : groupName
        }
        const token = Token.getLocalStorageData('splitzoneToken');
        try{

            const response = await fetch(`${serverURI}/api/app/group`, {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ token
                                }, 
                                body: JSON.stringify(groupData)
                            })
            if(!response.status === 200){
                // false response
            }
            const newGroup = await response.json();
            newGroup.billCount = 0;
            const newGroupsData = [newGroup, ...state.groupsData]
            dispatch({type: "setGroupsData", payload: newGroupsData})
            dispatch({type: "setCreateGroupB", payload: false})
            dispatch({type: "loadingButtonCreateGroup", payload: false})
        }catch(error){
           
        }  
    }
    if(state.loading) return <ComLoader />
    else return (
        <div className = "groupsContainer">
            {/* BANNER */}
            <DBanner />
            <ul className = "Gul">

                {/* disabled */}
                {state.loading && <GroupLoader/>}

                {/* Rest components to show */}
                {!state.loading && 
                    <li className ="GulCreateLi">
                        <CreateGroupButton 
                            createGroupClickHandler = {createGroupClickHandler}
                        />  
                    </li>
                }
                {!state.loading && <GroupList groups = {state.groupsData} ToBills = {ToBills}></GroupList>}
                
            </ul>

            {state.createGroup 
                && 
                <CreateGroupComponent 
                    createGroupClickHandler = {createGroupClickHandler} 
                    createGroupHandler = {createGroupHandler}
                    createGroupError = {state.createGroupError}
                    loadingButtonCreateGroup = {state.loadingButtonCreateGroup}
                />}

        </div>
    )
}

function CreateGroupButton({createGroupClickHandler}){
    return(
        <button className = "createGButton" onClick = {e => createGroupClickHandler()}>
            <span className = "createGButtonIconC">
                <MdAddCircleOutline/>
            </span>
            <span className = "createGButtonText">Create Group</span>
        </button>
    ) 
}

function GroupLoader(){
    return (
        <React.Fragment>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>
        </React.Fragment>
    )


}

function GroupList(props){
    return props.groups.map(groupListItem => {
        const date = new Date(groupListItem.createdAt);
        const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthArray[date.getMonth()];
        const monthDate = date.getDate();
        const membersLength = groupListItem.members.length - 1;
        const createdBy = groupListItem.createdBy;
        return(<li className = "GListSIContainer" key = {groupListItem._id} onClick = {() => {props.ToBills(groupListItem._id)}} >
                    {/* <div>{groupListItem.createdBy}</div>
                    <div>{groupListItem.members.length}</div> */}
                <div className = "GLi_groupName">
                    <h3>{groupListItem.groupName}</h3>
                    <div className = "GLi_menu"></div>
                    <div className = "GLi_dateCreated">
                        <h3>{monthDate}</h3>
                        <p>{month}</p>
                    </div>
                    <div className = "GLi_billsNumber">
                        <h3>{groupListItem.billCount}</h3>
                        <p>Bills</p>
                    </div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GLi_profileIcons">
                    {groupListItem.createdByImgUrl ? 
                        <img className = "GLi_profileIcon GLIP_first" alt = "creater_image" src = "https://images.pexels.com/photos/3768163/pexels-photo-3768163.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"></img>:
                        <h1 className = "GLi_profileIcon GLIP_first">{createdBy.charAt(0).toUpperCase() + createdBy.charAt(1).toUpperCase()}</h1>
                    }
                    <p className = "GLi_profileIcon GLIP_second">{createdBy.replace(createdBy.charAt(0), createdBy.charAt(0).toUpperCase() )}<b>+</b><b>{(membersLength > 0) ? membersLength : 0}</b> others</p>
                </div>
                </li>)
    })
}

function CreateGroupComponent({createGroupClickHandler,createGroupHandler, createGroupError, loadingButtonCreateGroup}){
    const createGroupRef = useRef(null);
    const [groupName, setGroupName] = useState("");

    function outsideClickHandler(e){
        if(createGroupRef.current && !createGroupRef.current.contains(e.target)){
            createGroupClickHandler()
        }
        else {
            return null
        }
    }
    useEffect(() => {
            window.addEventListener("click", outsideClickHandler, false);
            
        return (() => {
            window.removeEventListener("click", outsideClickHandler, false);
        })
    })

    return (
        <div className = "GCreateContainer">
            <div className="createGroup" ref = {createGroupRef}>
                <h3>Enter Group Name</h3>
                {createGroupError && <p>{createGroupError}</p>}
                <input 
                    type="text" 
                    name="groupName" 
                    id="groupNameInput" 
                    value = {groupName}
                    onChange = {(e) => setGroupName(e.target.value)}
                />
                <button 
                    disabled = {loadingButtonCreateGroup}
                    onClick = {e => {
                        createGroupHandler(e,groupName)}
                    }>{loadingButtonCreateGroup ? "..." : "create group"}</button>
            </div>
        </div>
    )
}