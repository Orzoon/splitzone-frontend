import React, {useState, useEffect, useRef, useReducer, useContext} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {serverURI} from "../../helpers/GlobalVar"
import Token from "../../helpers/token"
import DBanner from "../Dashboard/DBanner";
import ComLoader from "./ComLoader";
// icons
import {MdAddCircleOutline} from "react-icons/md";

import "../../css/Groups.scss";
import {socketContext, notificationContext} from '../App/App';
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
            return {...state, errors:action.payload}
        case "loadingButtonCreateGroup":
            return {...state, loadingButtonCreateGroup: action.payload}
        /* SOCKET ACTIONS */
        case "S_AddedTOGroup":
            console.log("Grouppayloadis", action.payload)
            return {...state, groupsData: [action.payload, ...state.groupsData]}
        case "S_RemoveFromGroup":
            const filteredData = state.groupsData.filter(item => item._id.toString() !== action.payload.toString())
            return {...state, groupsData: filteredData}
        case "S_DeleteGroup": 
            const filteredGroupData = state.groupsData.filter(item => item._id.toString() !== action.payload.toString())
            return {...state, groupsData: filteredGroupData}
        default: 
            return state;
    }
}

const initialGroupState = {
    loading: true,
    errors: {},
    groupsData: null,
    createGroup: false,
    createGroupError: null,
    loadingButtonCreateGroup: false
}
export default function Groups(){
    const socket = useContext(socketContext);
    const notification = useContext(notificationContext)
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

                if(!response.ok){
                    const errorData = await response.json()
                    throw (errorData)
                }

                const data = await response.json();
                dispatch({type: "setGroupsData", payload: data})
                dispatch({type: "setLoadingB", payload: false})
            }catch(error){
              // handle initial loading errors with groupError --LATERON
            }
        }
        getGroups();
    }, [])

    /* SOCKET IO FUNCTONS */
    useEffect(() => {
      
        setTimeout(() => {
            console.log("socket", socket)
        }, 3000)
        socket.on("S_AddedTOGroup", groupData => {
            S_AddedTOGroup(groupData)
        })
        socket.on("S_RemoveFromGroup", groupId => {
            dispatch({type: "S_RemoveFromGroup", payload: groupId})
        })
        socket.on('S_DeleteGroup', groupId => {
            dispatch({type: "S_DeleteGroup", payload: groupId})
        })
     

        return () => {
            socket.off("S_AddedTOGroup")
            socket.off("S_RemoveFromGroup")
            socket.off("S_DeleteGroup")
        }
    }, [])


    /* SOCKET FUNCTIONs */
    function S_AddedTOGroup(groupData){
        console.log("addedTOGroup", groupData)
        dispatch({type: "S_AddedTOGroup", payload: groupData})
    }


    /* END OF SOCKET FUNCTIONS */
    function ToBills(groupID){
        history.push(url + "/" + groupID);
    }

    function createGroupClickHandler(){
       dispatch({type: "setCreateGroupB", payload: !state.createGroup})

       // removing previously set Errors open component mount
       if(state.createGroup){
        dispatch({type: "setError", payload: {}})
       }
    }

    async function createGroupHandler(e, groupName){
        dispatch({type: "loadingButtonCreateGroup", payload: true})
        dispatch({type: "setError", payload: {}})
        e.preventDefault();

        // if(!groupName || groupName.trim().length <= 0){
        //     dispatch({type: "setError", payload: "Empty group name"})
        //     dispatch({type: "loadingButtonCreateGroup", payload: false})
        //     return null
        // }

        // if(groupName && groupName.trim().length > 15){
        //     dispatch({type: "setError", payload: "Group name should be no more than 15 characters"})
        //     dispatch({type: "loadingButtonCreateGroup", payload: false})

        //     return null
        // }

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
            if(!response.ok){
                const errorData = await response.json();
                throw (errorData);
            }

            const newGroup = await response.json();
            newGroup.billCount = 0;
            const newGroupsData = [newGroup, ...state.groupsData]

            dispatch({type: "setGroupsData", payload: newGroupsData})
            dispatch({type: "setCreateGroupB", payload: false})
            dispatch({type: "loadingButtonCreateGroup", payload: false})

        }catch(error){
            let errorObj = {};
            // catch for serverSideErrors
            if(error.statusCode === 400 && error.hasOwnProperty('message') && Array.isArray(error.message)){
                        const messageArray = error.message;
                        messageArray.forEach(message => errorObj[message.param] = message.msg)
            }
            else if(error.statusCode === 400 || error.status === 400) {
                    errorObj.message = error.message
            }
            else if (error.status === 500){
                errorObj.message = error.message
                }
            else{
                errorObj.message = "Something went wrong try again later"
            }
            dispatch({type: "setError", payload: errorObj})
            dispatch({type: "loadingButtonCreateGroup", payload: false})
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
                    errors = {state.errors}
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

function CreateGroupComponent({createGroupClickHandler,createGroupHandler, createGroupError, loadingButtonCreateGroup, errors}){
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
            <form className="createGroup" ref = {createGroupRef} onSubmit = {e =>  createGroupHandler(e,groupName)}>
                <h3>Enter Group Name</h3>
                {createGroupError && <p>{createGroupError}</p>}
                <input 
                    type="text" 
                    name="groupName" 
                    id="groupNameInput" 
                    value = {groupName}
                    onChange = {(e) => setGroupName(e.target.value)}
                />
                {errors && errors.groupName && <p>{errors.groupName}</p>}
                {errors && errors.message && <p>{errors.message}</p>}
                <button 
                    disabled = {loadingButtonCreateGroup}
                    type = "submit"
                   >{loadingButtonCreateGroup ? "..." : "create group"}</button>
            </form>
        </div>
    )
}