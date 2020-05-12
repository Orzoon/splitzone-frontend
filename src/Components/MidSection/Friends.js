import React, {useState, useEffect, useReducer, useRef} from 'react';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token";


// ICONS
import {
    MdAddCircleOutline, 
    MdLink,
    MdDelete,
    MdChat
} from "react-icons/md";
import DBanner from "../Dashboard/DBanner";
import ComLoader from "./ComLoader";
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
    formErrors: null,
    updateFriendName: null,
    updateFriendId: null
}

export default function Friends(){
    const [state, dispatch] =useReducer(friendsReducer, initialFriendsState)

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
            if(friendsResponse.status !== 200){
                // check error and set error
            }
            const userFriendsdata = await friendsResponse.json();
            dispatch({type: "setUserFriends", payload:userFriendsdata})
            dispatch({type: "setLoading"})
        }
        catch(error){
          // catching errors later on
        }
     }


     getFriends();
   }, [])


   async function createNewFriendHandler(e, values){
        dispatch({type: "addFrindBtnStatus", payload: true})
        e.preventDefault();
        if(values.name.length <= 5 || values.name.length === 0){
            dispatch({type: "setFormErros", payload: "Friend name cannot be empty and should be 6 characters long" })
            dispatch({type: "addFrindBtnStatus", payload: false})
            return null
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
            if(createdFriendResponse.status !== 200){
                if(createdFriendResponse.status === 400){
                    const errorData = await createdFriendResponse.json();
                    dispatch({type: "setFormErros", payload: errorData.error})
                    dispatch({type: "addFrindBtnStatus", payload: false})
                }
                if(createdFriendResponse.status === 422){
                    const errorData = await createdFriendResponse.json();
                    dispatch({type: "setFormErros", payload: errorData[0].msg})
                    dispatch({type: "addFrindBtnStatus", payload: false})
                }
                return null
            }else {
                const Friendsdata = await createdFriendResponse.json();
                // friendsData contains all the freinds adata and the _id
                dispatch({type: "setUserFriends", payload:Friendsdata});
                dispatch({type: "addFrindBtnStatus", paylaod: false})
                dispatch({type: "showFriendForm", payload: false});
            }
        }
        catch(error){
           // handling errors
        }
   }
   async function updateFriendsEmail(e, formValues){
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

            if(createdFriendResponse.status !== 200){
                if(createdFriendResponse.status === 400){
                    const errorData = await createdFriendResponse.json();
                    dispatch({type: "setFormErros", payload: errorData.error})
                    dispatch({type: "addFrindBtnStatus", payload: false})
                }
                if(createdFriendResponse.status === 422){
                    const errorData = await createdFriendResponse.json();
                    dispatch({type: "setFormErros", payload: errorData[0].msg})
                    dispatch({type: "addFrindBtnStatus", payload: false})
                }
                return null
            }else {
                const Friendsdata = await createdFriendResponse.json();
                // friendsData contains all the freinds adata and the _id
                dispatch({type: "setUserFriends", payload:Friendsdata});
                dispatch({type: "addFrindBtnStatus", paylaod: false})
                dispatch({type: "updateFriendName", payload: null})
                dispatch({type: "updateFriendId", payload: null})
                dispatch({type: "showFriendForm", payload: false})
            }
        }catch(error){
            console.log("error")
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
    dispatch({type: "setFormErros", payload: null})
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
                {console.log("userFrendssatet", state.userFriends)}
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
    const formRef = useRef(null)

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
                        <h3>{updateFriendId ? `Enter ${updateFriendName}'s email` : "Enter friend Details"}</h3>
                        {formErrors && <p>{formErrors}</p>}
                        <input
                            type = 'text'
                            name = "name"
                            placeholder = "JohnDoe *"
                            onChange = {createNewFormHandler}
                            value = {updateFriendId ? updateFriendName: values.name}
                            disabled =  {updateFriendId ? true: false}
                        />
                        <input
                            type = "email"
                            name = "email"
                            placeholder = "example@gmail.com"
                            onChange = {createNewFormHandler}
                        />
                        <button>{addFrindBtnStatus ? "..." : "Add to friend list"}</button>
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
                            <span className = "FBIcon ButtonIcon blueBg"><MdLink /></span>
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