import React, {useEffect, useState, useContext} from "react";
import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
import {AppUserContext} from "../App/App"


export default function BillForm(props){
    const user = useContext(AppUserContext)
    const {groupID} = props;
    const [groupMembers, setGroupMembers] = useState(null);

    useEffect(() => {
        const token = Token.getLocalStorageData('splitzoneToken');
        async function fetchGroupMembersData(){
            try{
                const groupMemberResponse = await fetch(`${serverURI}/api/app/group/${groupID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                })

                if(groupMemberResponse.status !== 200){
                        console.log("some thing went wrong/// find that in catch statement")
                        return 
                }   

                const groupData = await groupMemberResponse.json();
                if(groupData.members.length > 1){
                    setGroupMembers(groupData.members)
                }
        }
        catch(error){
            console.log(error)
        }
        }

        fetchGroupMembersData();
    }, [])


    return (
        <div className = "Bill_Form_Container">
            <form className = "Bill_Form"  id = "Bill_Form">
                <button  
                    type = "button"
                    onClick = {props.showBillFormToggleHandler}
                    className = "Bill_Form_Close">
                        close
                </button>


                <input 
                    name = "Amount"
                    placeholder = "Amount"
                />    
                <br />
                <select>
                    <option value = "including">including</option>
                    <option value = "excluding">excluding</option>
                </select> you
                <br />
                paid by <select>
                            {groupMembers && groupMembers.length > 1 && 
                                groupMembers.map(member => {
                                    if(member._id === user._id){
                                        return <option key = {member._id} value = {member._id} defaultChecked>You</option>
                                    }
                                    else {
                                        return <option key = {member._id} value = {member._id}>{member.name}</option>
                                    }

                                })
                            }
                        </select>
            </form>
        </div>
    )
}