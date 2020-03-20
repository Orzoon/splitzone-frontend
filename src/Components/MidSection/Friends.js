import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token"
import {AppUserContext} from "../App/App"

// ICONS


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
    console.log(email)

   }

    return (
        <div className = "friendsContainer">
            <ul>
                {!isLoading &&
                    <li key = "1">
                        <button onClick = {(e) => setFriendBtnStatus(!newFriendBtnStatus)}>add new friend</button>
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

    const {name, email, registered, _id} = props.friendItem;
    return (
        <li key = {props.friendItem._id}>
            <div>
                {name}
            </div>
            <div>
                {email}
            </div>
            {/* 
                if not registered send invite and no chat options
                else chat options and options to chat and splitzone memeber indication
            */}
            {!registered && email &&
                <button onClick = {e => props.sendSplitzoneInvite(e, email)}>send invite</button>
            }
            { registered && 
                <button>chat</button>
            }

            <button onClick = {(e) => props.removeFriendHandler(e, _id)}>remove user</button>
        </li>
    )

}