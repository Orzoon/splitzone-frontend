import React, {useState, useEffect, useReducer, useRef, useContext} from 'react';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token";

// ICONS
import {
    MdAddCircleOutline, 
    MdLink,
    MdDelete,
    MdChat,
    MdEmail
} from "react-icons/md";
import DBanner from "../Dashboard/DBanner";
import ComLoader from "./ComLoader";
import {notificationContext, socketContext, AppUserContext} from "../App/App";
import {LoaderButton,
    CardConfirmation} from "../UIC/UIC";
// scss
import "../../css/Friends.scss";

const friendsReducer = function(state, action){
    switch(action.type){
        case "setUserFriends":
            return {...state, userFriends: action.payload}
        case "setLoading": 
            return {...state, loading: !state.loading}
        case "showFriendForm":
            return {...state, showFriendForm: action.payload}
        case "addFrindBtnStatus": 
            return {...state, addFrindBtnStatus: action.payload}
        case "setFormErros":
            return {...state, formErrors: action.payload}
        case "updateFriendName": 
            return {...state, updateFriendName: action.payload}
        case "updateFriendId": 
            return {...state, updateFriendId: action.payload}
        default:
            return state
    }
}

const initialFriendsState = {
    loading: true,
    userFriends: null,
    showFriendForm: false,
    addFrindBtnStatus: false,
    formErrors: {},
    updateFriendName: null,
    updateFriendId: null,
}

export default function Friends(){
    const user = useContext(AppUserContext);
    const notification= useContext(notificationContext);
    const IO = useContext(socketContext)
    const [state, dispatch] =useReducer(friendsReducer, initialFriendsState);
    //Implement ErrorHadling logic-> component-TODO
    // setErros and show errors
    useEffect(() => {
     async function getFriends() {
        const token = Token.getLocalStorageData('splitzoneToken');
        try{
            let friendsResponse = await fetch( `${serverURI}/api/app/friends`,{
               method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                }
            })

            /* ERROR ? */
            if(!friendsResponse.ok){
                const errorData = await friendsResponse.json();
                throw(errorData)
            }

            const userFriendsdata = await friendsResponse.json();
            dispatch({type: "setUserFriends", payload:userFriendsdata})
            dispatch({type: "setLoading"})
        }
        catch(error){
            // handle Errors later with error component
        }
     }
     getFriends();
   }, [])
   /*IO EVENTS */
   useEffect(() => {
        IO.on('S_NotificationCount', () => {
         notification.setNotificationCount(prevCount => prevCount + 1)
        })
   }, [])
   /* IO EVENTS END */
   async function createNewFriendHandler(e, values){
        e.preventDefault()
        // clearing out the initial errors
        dispatch({type: "setFormErros", payload: {}})
        dispatch({type: "addFrindBtnStatus", payload: true})
        // new logic if the length of email is zero just send the name key pair
        // SERVERSIDEVALIDATON FOR NOW -- SET BELOW VALIDTION FOR EMAIL AND USERNAME LATER
        // if(values.name.length <= 4 || values.name.length === 0){
        //     let errorObj = {};
        //     errorObj.name = "Friend name cannot be less than 4 characters"
        //     dispatch({type: "setFormErros", payload: errorObj})
        //     dispatch({type: "addFrindBtnStatus", payload: false})
        //     return null
        // }
        // check for the same email--> CANNOT ADD YOURSELF
        const email = values.email;
        if(email.toString().trim().toLowerCase() ===  user.email.toString().trim().toLowerCase()){
            let errorObj = {};
                errorObj.message = "You cannot add yourself to the list"
                dispatch({type: "setFormErros", payload: errorObj})
                dispatch({type: "addFrindBtnStatus", payload: false})
                return 
        }

        const token = Token.getLocalStorageData('splitzoneToken');
        try{
            let createdFriendResponse = await fetch( `${serverURI}/api/app/friend`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                },
                body: JSON.stringify(values)
            })
            if(!createdFriendResponse.ok){
                const errorData = await createdFriendResponse.json();
                throw (errorData);
            }

            const Friendsdata = await createdFriendResponse.json();
            // friendsData contains all the freinds adata and the _id
            dispatch({type: "setUserFriends", payload:Friendsdata});
            dispatch({type: "addFrindBtnStatus", paylaod: false})
            dispatch({type: "showFriendForm", payload: false});
        }
        catch(error){
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
            dispatch({type: "setFormErros", payload: errorObj})
            dispatch({type: "addFrindBtnStatus", payload: false})
        }
   }
   async function updateFriendsEmail(e, formValues){
        dispatch({type: "setFormErros", payload: {}})
        dispatch({type: "addFrindBtnStatus", payload: true})
        e.preventDefault();
        const token = Token.getLocalStorageData('splitzoneToken');
        try{
            const values = {
                name: state.updateFriendName,
                email: formValues.email,
                friendId: state.updateFriendId
            }
            let createdFriendResponse = await fetch( `${serverURI}/api/app/friend`,{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                },
                body: JSON.stringify(values)
                    })
            if(!createdFriendResponse.ok){
                const errorData = await createdFriendResponse.json();
                throw (errorData)
            }
            
            const Friendsdata = await createdFriendResponse.json();
            // friendsData contains all the freinds adata and the _id
            dispatch({type: "setUserFriends", payload:Friendsdata});
            dispatch({type: "addFrindBtnStatus", paylaod: false})
            dispatch({type: "updateFriendName", payload: null})
            dispatch({type: "updateFriendId", payload: null})
            dispatch({type: "showFriendForm", payload: false});
        }
        catch(error){
            let errorObj = {};
            console.log("error", error)
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
            dispatch({type: "setFormErros", payload: errorObj})
            dispatch({type: "addFrindBtnStatus", payload: false})
        } 
   }
   async function removeFriendHandler(e, id){
    e.preventDefault();
    const token = Token.getLocalStorageData('splitzoneToken');
    try{
        let deleteFriendResponse = await fetch( `${serverURI}/api/app/friend/${id}`,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        if(deleteFriendResponse.status !== 200){
           // set and display errorMessage
        }

        const friendsData = state.userFriends;
        const filteredData = friendsData.friends.filter(item => item._id !== id);
        friendsData.friends = filteredData;
        dispatch({type: "setUserFriends", payload:friendsData})
        
    }
    catch(error){
       // setting error msgg later on
    }
   }
   async function sendSplitzoneInvite(e, email){
    e.preventDefault();
   }
   function outSideUtil(){
    dispatch({type: "setFormErros", payload: {}})
    dispatch({type: "showFriendForm", payload: false});
    // clearing friends update data
    dispatch({type: "updateFriendName", payload: null})
    dispatch({type: "updateFriendId", payload: null})
     if(state.addFrindBtnStatus){
        dispatch({type: "showFriendForm", payload: false})
     }
   }
   function showUpdateForm(e, _id, name){
       e.preventDefault();
        /* the forms used are the same */
        // set the  friend_id, and the name in the form
        dispatch({type: "setFormErros", payload: null})
        // setting the friend_id and the name
        dispatch({type: "updateFriendName", payload: name})
        dispatch({type: "updateFriendId", payload: _id})
        console.log("state", state)
        dispatch({type: "showFriendForm", payload: true});

   }
    if(state.loading) return <ComLoader />
    else return (
        <div className = {state.showFriendForm ? "friendsContainer friendContainerHeightFix" : "friendsContainer"}>
            <DBanner />
            <ul>
                {!state.Loading &&
                    <li key = "1" className = "AddFriendButtonList">
                        <button 
                            className = "AddFriendButton"
                            onClick = {(e) => {
                                    dispatch({type: "setFormErros", payload: null})
                                    dispatch({type: "showFriendForm", payload: true})}
                                }>
                            <span className = "createGButtonIconC"><MdAddCircleOutline/></span>
                            <span className = "createGButtonText">Add friend</span>
                        </button>
                    </li>
                }
                {!state.Loading && state.userFriends && 
                    state.userFriends.friends
                    .map(friendItem => <FriendList 
                            friendItem = {friendItem} 
                            removeFriendHandler = {removeFriendHandler} 
                            sendSplitzoneInvite = {sendSplitzoneInvite}
                            key = {friendItem._id}
                            showUpdateForm = {showUpdateForm}
                        />)
                }
            </ul>

            {state.showFriendForm &&
                <AddFriendForm 
                    createNewFriendHandler ={createNewFriendHandler}
                    addFrindBtnStatus = {state.addFrindBtnStatus}
                    outSideUtil = {outSideUtil}
                    formErrors = {state.formErrors}
                    updateFriendName = {state.updateFriendName}
                    updateFriendId = {state.updateFriendId}
                    updateFriendsEmail = {updateFriendsEmail}
                />
            }  
        </div>
    )
}

function AddFriendForm({createNewFriendHandler, addFrindBtnStatus, outSideUtil, formErrors, updateFriendId, updateFriendName, updateFriendsEmail}){
    const [values, setValues] = useState({name: "", email: ""})
    const formRef = useRef(null);

    function createNewFormHandler(e){
        const name = e.target.name;
        const value = e.target.value;
        setValues(prevValue => {
            return {...prevValue, [name] : value}
        })
    }
    function outsideClickHandler(e){
        if(formRef.current && !formRef.current.contains(e.target)){
            outSideUtil()
        }
    }
    useEffect(() => {

        window.addEventListener("click", outsideClickHandler, false);
        
        return (() => {
            window.removeEventListener("click", outsideClickHandler, false);
        })
    })
    return(
        <div className = "addNewFriend friendContainerHeightFix" >
                    <form onSubmit = {e => {
                                    if(updateFriendId){
                                        updateFriendsEmail(e, values)
                                    }else{
                                        createNewFriendHandler(e, values)
                                    }
                                }
                         } 
                        ref = {formRef}
                        >
                        {updateFriendId ? <h3>Enter {updateFriendName}'s email</h3> : <h3>Enter friend Details</h3>}
                        {updateFriendId ? 
                            <input
                                type = 'text'
                                name = "name"
                                placeholder = "JohnDoe *"
                                onChange = {createNewFormHandler}
                                value = {updateFriendName}
                                disabled =  {updateFriendId ? true: false}
                            />
                                : 
                            <input
                                type = 'text'
                                name = "name"
                                placeholder = "JohnDoe *"
                                onChange = {createNewFormHandler}
                                value = {values.name}
                                disabled =  {updateFriendId ? true: false}
                            />
                        }
                       {formErrors && formErrors.name && <p>{formErrors.name}</p>}
                        <input
                            type = "email"
                            name = "email"
                            placeholder = "example@gmail.com"
                            onChange = {createNewFormHandler}
                        />
                        {formErrors && formErrors.email && <p>{formErrors.email}</p>}
                        {formErrors && formErrors.message && <p>{formErrors.message}</p>}
                        {addFrindBtnStatus ? <LoaderButton/> : <button>Add to friend list</button>}
                    </form>
                </div>
    )
}

function FriendList(props){

    const {name, email, registered, _id, imageLink} = props.friendItem;
    return (
        <li key = {props.friendItem._id} className = "friendProfileList">
            <div className = "friendCardUpper">
                {imageLink ? 
                    <img   alt = "friendIamge" 
                            src = {imageLink} 
                            className = "friendImage" 
                    /> :
                    <h1  className = "friendImage" >{name.charAt(0) + name.charAt(1)}</h1>
                }
            </div>

            <div className = "friendCardLower">
                {name && <h1>{name.replace(name.charAt(0),name.charAt(0).toUpperCase())}</h1>}
                {email && <h1>{email}</h1>}
            </div>
            {/* 
                if not registered send invite and no chat options
                else chat options and options to chat and splitzone memeber indication
            */}
            <div className = "friendCardButtons">
                {!registered && !email &&
                    <button 
                        onClick = {e => props.showUpdateForm(e, _id, name)}
                        className = "friendBtnInvite GlobalBtnSecondary">
                            <span className = "FBText ButtonText blueColor">Add Email</span>
                            <span className = "FBIcon ButtonIcon blueBg"><MdLink /></span>
                    </button>
                }

                {!registered && email &&
                    <button 
                        onClick = {e => props.sendSplitzoneInvite(e, email)}
                        className = "friendBtnInvite GlobalBtnSecondary">
                            <span className = "FBText ButtonText blueColor">send invite</span>
                            <span className = "FBIcon ButtonIcon blueBg"><MdEmail /></span>
                    </button>
                }
                { registered && 
                    <button  className = "friendBtnChat GlobalBtnSecondary">
                        <span className = "FBText ButtonText greenColor">chat</span>
                        <span className = "FBIcon ButtonIcon greenBg"><MdChat /></span>
                    </button>
                }
                <button 
                    className = "friendBtnRemove GlobalBtnSecondary"
                    onClick = {(e) => props.removeFriendHandler(e, _id)}>
                        <span className = "FBText ButtonText redColor">remove</span>
                        <span className = "FBIcon ButtonIcon redBg"><MdDelete /></span>
                </button>
            </div>
        
        </li>
    )

}