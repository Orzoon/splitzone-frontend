import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token"
import {AppUserContext} from "../App/App"

// ICONS
import {
    MdAddCircleOutline, 
    MdLink,
    MdDelete,
    MdChat
} from "react-icons/md";
import DBanner from "../Dashboard/DBanner";
// scss
import "../../css/Friends.scss";


export default function Friends(){
    const history = useHistory();
    const [isLoading, setisLoading] = useState(true);
    const [userFriends, setuserFriends] = useState(null);
    const [newFriendBtnStatus, setFriendBtnStatus] = useState(false);
    const [values, setValues] = useState({name: "", email: ""})

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
                console.log("error")
                //error
            }
            const userFriendsdata = await friendsResponse.json();
            setuserFriends(userFriendsdata)
            setisLoading(false);
        }
        catch(error){
            console.log(error)
        }
     }


     getFriends();
   }, [])

   function createNewFormHandler(e){
        const name = e.target.name;
        const value = e.target.value;
        setValues(prevValue => {
            return {...prevValue, [name] : value}
        })
   }

   async function createNewFriendHandler(e){
        e.preventDefault();

        //note
        // validation
        // length, number, and type
        if(values.name.length === 0 || values.email.length === 0 ){
            console.log("no value")
            return 
        }

    
        const token = Token.getLocalStorageData('splitzoneToken');
        try{
            let createFriendResponse = await fetch( `${serverURI}/api/app/friend`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                },
                body: JSON.stringify(values)
            })
            if(createFriendResponse.status !== 200){
                // error message
                console.log("user cannot be created someting wrong")
                return 
            }

            setFriendBtnStatus(!newFriendBtnStatus);

            history.push('/temp');
            history.goBack();
            const createFriendsdata = await createFriendResponse.json();

        }
        catch(error){
            console.log(error)
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
            // error message
            console.log("user cannot be created someting wrong")
            return 
        }
        console.log(deleteFriendResponse)
        console.log("succesfully removed a friend")
        history.push("/temp");
        history.goBack();

    }
    catch(error){
        console.log(error)
    }
   }

   async function sendSplitzoneInvite(e, email){
    e.preventDefault();
   }

    return (
        <div className = "friendsContainer">
            <DBanner />
            <ul>
                {!isLoading &&
                    <li key = "1" className = "AddFriendButtonList">
                        <button 
                            className = "AddFriendButton"
                            onClick = {(e) => setFriendBtnStatus(!newFriendBtnStatus)}>
                            <span className = "createGButtonIconC"><MdAddCircleOutline/></span>
                            <span className = "createGButtonText">Add friend</span>
                        </button>
                    </li>
                }
                {!isLoading && userFriends && 
                    userFriends.friends
                    .map(friendItem => <FriendList 
                            friendItem = {friendItem} 
                            removeFriendHandler = {removeFriendHandler} 
                            sendSplitzoneInvite = {sendSplitzoneInvite}
                        />)
                }
            </ul>

            {newFriendBtnStatus &&
                <div className = "addNewFriend">
                    <form onSubmit = {createNewFriendHandler}>
                        <input
                            type = 'text'
                            name = "name"
                            placeholder = "friend Name"
                            onChange = {createNewFormHandler}
                        />
                        <input
                            type = "email"
                            name = "email"
                            placeholder = "email *"
                            onChange = {createNewFormHandler}
                        />
                        <button>add</button>
                    </form>
                </div>
            }  
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
                {name && <h1>{name}</h1>}
                {email && <h1>{email}</h1>}
            </div>
            {/* 
                if not registered send invite and no chat options
                else chat options and options to chat and splitzone memeber indication
            */}
            <div className = "friendCardButtons">
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