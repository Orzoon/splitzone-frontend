import React, {useState, useEffect, useContext, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token"
import {AppUserContext} from "../App/App"

// ICONS

import {MdAdd} from "react-icons/md"
// scss
import "../../css/Bills.scss";

// subComponents
import BillForm from '../subComponent/Bill_Form'


/*--------------

MAIN BILLS COMPONENT

----------------*/



export default function Bills(props){
    const {groupID} = props.match.params;
    const [isLoading, setisLoading] = useState(true);
    const [group, setGroup] = useState({});
    const [bills, setBills] = useState([]);
    const [errors, setErrors] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [showEditRemoveMembersB,setShowEditRemoveMembersB] = useState(false)
    const [showBillFormB, setShowBillFormB] = useState(false)

    useEffect(() => { 
        async function getData(groupID){
            const token = Token.getLocalStorageData('splitzoneToken');

            try{
                const groupResponse = await fetch(`${serverURI}/api/app/group/${groupID}`, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ token
                            }
                        })
                const Billsresponse = await fetch(`${serverURI}/api/app/bills/${groupID}/10/0`, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ token
                            }
                        })
        
                if(groupResponse.status !== 200 || Billsresponse.status  !==200){
                    return console.log('some error')
                }

                const [groupData, billsData] = [await groupResponse.json(), await Billsresponse.json()]

                setGroup(groupData)
                setBills(billsData)
                setShowDetails(true)
                setisLoading(false)

               
            }catch(error){
                console.log(error)
            }
        }
        getData(groupID);
    }, [])


    function HideShowDetailsHandler(){
        setShowDetails(false);
    }
    function showBillFormToggleHandler(){
        setShowBillFormB(!showBillFormB)
    }
    function showEditRemoveMembersBHandler(){
        setShowEditRemoveMembersB(!showEditRemoveMembersB)
    }
    async function removeBillHandler(_id){
        const token = Token.getLocalStorageData('splitzoneToken');
        const billID = _id;

        try{
           
            const billDeleteResponse = await fetch(`${serverURI}/api/app/bill/${groupID}/${billID}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                }
            })


            if(billDeleteResponse.status !== 200){
                // throe code for an error
                console.log("error occured")
                return
            }

            const billsCopy = [...bills];
            const filteredBill = billsCopy.filter(bill => bill._id !== billID)
            setBills(filteredBill);

        }
        catch(error){
            console.log(error)
        }
    }

    if(isLoading){
        return (
            <div className = "billsContainer">
                <BillsLGContainer />
                <BillsLBContainer />
            </div>
        )
    }

    return (
        <div className = "billsContainer">
            <BillsGroup 
                group = {group} 
                showEditRemoveMembersBHandler = {showEditRemoveMembersBHandler} 
                showBillFormToggleHandler = {showBillFormToggleHandler}
            />

            {/* conditional Details */}
            {showDetails && <BillsGroupDetails hideShowDetails = {HideShowDetailsHandler}/>}
            <BillsSummary 
                bills = {bills} 
                groupMembers = {group.members}
            />
            <BillsFilter/>
            {/* <BillsTitle/> */}
            <BillsComponent 
                bills = {bills}
                removeBillHandler = {removeBillHandler}
            />
            {showEditRemoveMembersB && <EditRemoveMembers 
                            showEditRemoveMembersBHandler = {showEditRemoveMembersBHandler} 
                            groupID = {groupID}
                            groupMembers = {group.members}
                        />}
            {showBillFormB && <BillForm 
                                showBillFormToggleHandler = {showBillFormToggleHandler}
                                groupID = {groupID}
                              />}
        </div>
    )
}


/*--------------
 LOADINGS COMPONENTS
----------------*/
function BillsLGContainer(){
    return (
        <div className = "BLGcontainer">
            <BillsLGHeader />
            <BillsLGHeaderDetails/>
        </div>
    )
}

function BillsLGHeader(){
    return (
        <div className = "BLGHeader">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

function BillsLGHeaderDetails(){
    return (
        <ul className = "BLGHeaderDeatils">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    )

}

function BillsLBContainer(){
    return (
        <ul className = "BLBcontainer">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    )
}

/*--------------
 COMPONENTS
----------------*/
function BillsGroup(props){
    const history = useHistory();
    const [showBillsMenu, setshowBillsMenu] = useState(false);
    const {group} = props;

    async function deleteGroupHandler(){
        // ask for  confirmation that group together with all the bills will get deleted
        const token = Token.getLocalStorageData('splitzoneToken');

        try{
            const groupID = group._id;
            const groupDeleteResponse = await fetch(`${serverURI}/api/app/group/${groupID}`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer '+ token
                }
            })

            if(groupDeleteResponse.status !== 200){
                // deletion error
            }
            
            history.push("/app/groups");
          
            

        }catch(error){
            console.log(error)
        }



   }

    return (
        <div className = "BGContainer">
            <h3>{group.groupName}</h3>
            <button onClick = {(e) => setshowBillsMenu(true)}>...</button>
            <p className = "BGCreatedBy"><span>created By: </span><span>{group.createdBy}</span></p>
            <p className = "BGCreatedAt"><span>created At:</span><span>{new Date(group.createdAt).toDateString() }</span></p>

            {showBillsMenu && 
            
            <div className = "showBillsMenu">
                <ul>
                    <li>
                        <button onClick = {(e) => setshowBillsMenu(false)}>Close</button>
                    </li>
                    <li>
                        <button onClick = {deleteGroupHandler}>delete Group</button>
                    </li>
                    <li>
                        <button onClick = {props.showEditRemoveMembersBHandler}>removeAddMembers</button>
                    </li>
                    <li>
                        <button>RemoveMember</button>
                    </li>
                    <li>
                        <button>Edit Grup</button>
                    </li>
                    <li>
                        <button>Summary Report</button>
                    </li>
                    <li>
                        <button onClick = {props.showBillFormToggleHandler}>add a bill</button>
                    </li>
                </ul>
            </div> }
        </div>
    )
}


function BillsGroupDetails(props){
    return (
        <ul className = "BGDetailsContainer">
            <li>
                <h3>Total Bills</h3>
                <h2>$50</h2>
            </li>
            <li>
                <h3>Total Amount</h3>
                <h2>$100</h2>
            </li>
            <li>
                <h3>you owe</h3>
                <h2>$30</h2>
            </li>
            <li>
                <h3>you lent</h3>
                <h2>$90</h2>
            </li>
            <button className = "B_closeBGDetails" onClick = {props.hideShowDetails}>x</button>
        </ul>
    )
}


/*--------------
 BILLS SUMMARY
----------------*/

function BillsSummary(props){
    const {bills, groupMembers} = props;
    console.log("bills", bills)
    const user = useContext(AppUserContext)
    const summaryOptions = {
        _id : "groupId",
        options: [{
            fullMonth : true,
            date: "month_year",
            splitMonth: [{from: "", to: ""}, {check_for_last_months: ""}]
        }]
    }

    const onlyUserBills = bills.filter(bill => {
        return bill.paidBy._id === user._id || bill.splittedAmongMembers.some(id => user._id === id);
    })

    let summaryDetails = [];
    
    onlyUserBills.forEach(bill => {
   
        // paidBy user and including user
        /* lent */
        if((bill.paidBy._id === user._id && bill.splittedAmongMembers.some(id => user._id === id)) || (bill.paidBy._id === user._id && bill.splittedAmongMembers.some(id => user._id !== id))){

                // divided equally
                if(bill.dividedEqually){
                    const amountValue = bill.paidAmount/bill.splittedAmongMembers.length;
                    // check summaryDetails Length
                    const filteredMemberIds = bill.splittedAmongMembers.filter(memberId => memberId !== user._id)

                    filteredMemberIds.forEach(memberIds => {
                        const memberName = groupMembers.filter(member => member._id === memberIds)[0].name;
                        const index = summaryDetails.findIndex(item => item._id === memberIds) ;
                        if(index !== - 1){
                            const prevValue = summaryDetails[index].youLent;
                            summaryDetails[index].youLent = prevValue + amountValue;
                        }
                        else {
                            const summaryDetailsCopy = [...summaryDetails];
                            const newObj = {
                                _id: memberIds,
                                name: memberName,
                                youLent: amountValue,
                                youOwe: 0
                            }

                            // pushing new object
                            summaryDetailsCopy.push(newObj)
                            summaryDetails = summaryDetailsCopy
                        }
                    })
                }

                // divided unequally
                if(!bill.dividedEqually){
        
                    //only members except others
                    const filteredMemberIds = bill.splittedAmongMembers.filter(memberId => memberId !== user._id)

                    filteredMemberIds.forEach(memberIds => {

                        
                        const memberName = groupMembers.filter(member => member._id === memberIds)[0].name;
                        // finding index of a member from divided prop
                        const dividedIndex = bill.divided.findIndex(item => item._id === memberIds);
                        // getting amount
                        const amountValue = bill.divided[dividedIndex].amount;

                        // now into SumaryDetails
                        const index = summaryDetails.findIndex(item => item._id === memberIds);
                        if(index !== - 1){
                            const prevValue = summaryDetails[index].youLent;
                            summaryDetails[index].youLent = prevValue + amountValue;
                        }
                        else {
                            const summaryDetailsCopy = [...summaryDetails];
                            const newObj = {
                                _id: memberIds,
                                name: memberName,
                                youLent: amountValue,
                                youOwe: 0
                            }

                            summaryDetailsCopy.push(newObj)
                            summaryDetails = summaryDetailsCopy
                        }
                    })
                }
        }

        // paid by others including user
        /* Owe */
        if(bill.paidBy._id !== user._id){
                // divided equally
                if(bill.dividedEqually){

                const memberName = groupMembers.filter(member => member._id === bill.paidBy._id)[0].name;
                const amountValue = bill.paidAmount/bill.splittedAmongMembers.length;
               

                const index = summaryDetails.findIndex(item => item._id === bill.paidBy._id);
                    if(index !== - 1){
                        const prevValue = summaryDetails[index].youOwe;
                        summaryDetails[index].youOwe = prevValue + amountValue;
                    }
                    else {
                        const summaryDetailsCopy = [...summaryDetails];
                        const newObj = {
                            _id: bill.paidBy._id,
                            name: memberName,
                            youLent: 0,
                            youOwe: amountValue
                        }

                        // pushing new object
                        summaryDetailsCopy.push(newObj)
                        summaryDetails = summaryDetailsCopy
                    }
         
                }

                if(!bill.dividedEqually){
                    const memberName = groupMembers.filter(member => member._id ===  bill.paidBy._id)[0].name;
                    // find the amount associated with the user
                    const amountValue = bill.divided.filter(item => item._id === user._id)[0].amount;
                   
                    const index = summaryDetails.findIndex(item => item._id === bill.paidBy._id);
                        if(index !== - 1){
                            const prevValue = summaryDetails[index].youOwe;
                            summaryDetails[index].youOwe = prevValue + amountValue;
                        }
                        else {
                            const summaryDetailsCopy = [...summaryDetails];
                            const newObj = {
                                _id: bill.paidBy._id,
                                name: memberName,
                                youLent: 0,
                                youOwe: amountValue
                            }
        
                            // pushing new object
                            summaryDetailsCopy.push(newObj)
                            summaryDetails = summaryDetailsCopy
                        }
             
                    }
        }

    })

    console.log("summaryDetails", summaryDetails)
    return (
        <div className = "BSummary"> 

        </div>

    )
}

/*--------------
 BILLS FILTER
----------------*/
function BillsFilter(){
    return (
        <div className = "BFilter">
            <ul className = "BPagination">
                {/* based on condition */}
                <li>prev</li>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>next</li>
            </ul>
        </div>
    )
}

/*--------------
 BILLS and Bill List Component
----------------*/

function BillsComponent({bills, removeBillHandler}){
    return (
        <ul className = "BComponent">
            {bills.map(billItem => {
                return <ListComponent  
                            key= {billItem._id} 
                            bill = {billItem}
                            removeBillHandler = {removeBillHandler}
                        />
            })}
        </ul>
    )
}


function ListComponent({bill, removeBillHandler}){
    const user = useContext(AppUserContext);
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'];
    return (
        <li className = "BComponentList">
            <ul className = "BULNested">
                <li className = "BULN_Date">
                    <div className= "month">{monthArray[new Date(bill.createdAt).getMonth()].toUpperCase()} </div>
                    <div className = "day">{new Date(bill.createdAt).getDate()}</div>
                </li>
                <li className = "BULN_Amount">
                    <h3 className = "amount">${bill.paidAmount}</h3>
                    <p><span className = "added_by">{bill.addedBy._id === bill.paidBy._id ? "Added &" : "Added By"}</span><span className = "addedByName">{bill.addedBy._id === bill.paidBy._id ? " " : bill.addedBy.name}</span></p>
                    <p><span className = "paid_by">Paid by</span><span className = "paidByName">{bill.paidBy.name}</span></p>
                </li>
                <li className = "BULN_Details">
                    {bill.splittedAmongMembers.some(item => item === user._id) && 
                        <p className = "including"><span>including</span> you</p>
                    }
                        <p className = "divided"><span>divided</span> {bill.dividedEqually ? "equally": " "}</p>
                        <p className = "among"><span>among</span> {bill.splittedAmongNumber}</p>
                </li>
                <li className ="BULN_Lentowe">
                    {bill.paidBy._id === user._id && <p className = "lentOwnTitle">you lent</p> }
                    {bill.paidBy._id === user._id &&
                        <p className = "lentOwnAmount">
                            {bill.splittedAmongMembers.some(member => member === user._id) ? 
                                // divided equally
                                bill.dividedEqually ? (bill.paidAmount - (bill.paidAmount/bill.splittedAmongNumber)).toFixed(2) : bill.divided.reduce((total, object) => {
                                    if(object._id === user._id){
                                        object.amount = 0;
                                    }
                                    total = total + object.amount
                                    return total
                                }, 0)
                            :
                            // not including the paidBy
                            bill.dividedEqually ? bill.paidAmount : bill.divided.reduce((total, object) => {
                                    total = total + object.amount
                                    return total
                                })
                            }
                        </p>
                    }
                    {bill.paidBy._id !== user._id && bill.splittedAmongMembers.some(item => item === user._id) && <p className = "lentOwnTitle">you owe</p>}
                    {bill.paidBy._id !== user._id && bill.splittedAmongMembers.some(item => item === user._id) &&
                        <p className = "lentOwnAmount">
                            {bill.dividedEqually ? (bill.paidAmount/bill.splittedAmongNumber).toFixed(2) : bill.divided.find(object => object._id === user._id).amount }
                        </p>
                    }
                </li>
                <li className = "BULN_button">
                    <button className = "deleteBillButton" onClick = {(e) => removeBillHandler(bill._id)}>
                        <MdAdd/>
                    </button>
                </li>
        </ul>
    </li>
)
}

/*--------------
 EditRemoveMembers
----------------*/

function EditRemoveMembers(props){
    const {groupID, showEditRemoveMembersBHandler} = props;
    const user = useContext(AppUserContext)
    const editRemoveInnerRef = useRef();
    const [friendsArray, setFriendsArray] = useState(null);
    const [groupMembers, setGroupMembers] = useState(null)
    const [mounted, setMounted] = useState(false)

    function outsideclickHandler(e){
        if(editRemoveInnerRef.current && !editRemoveInnerRef.current.contains(e.target)){
            showEditRemoveMembersBHandler();
        }
    }

    useEffect(() => {
        window.addEventListener("click", outsideclickHandler, false);
        // setting groupMembe 
        return(() => {
            window.removeEventListener('click', outsideclickHandler, false);
        })
    },[]) // End of UseEffect1


    useEffect(() => {
        if(!mounted){
            setMounted(true);
            return 
        }
      
        async function showGroupMemberHandler(){
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const getFriendsResponse = await fetch(`${serverURI}/api/app/friends`, {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer '+ token
                    }
                })

                const getGroupResponse = await fetch(`${serverURI}/api/app/group/${groupID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                })


                if(getFriendsResponse.status !== 200 || getGroupResponse.status !== 200){
                    //----SET ------getting data error
                }
    
                const friendsData = await getFriendsResponse.json();
                const groupsData = await getGroupResponse.json();


                if(!friendsData.friends.length > 0){
                    // no friends in friend list --handle
                    return 
                } 


                const friends = friendsData.friends;
                const members = groupsData.members;

                // filtering out the user from the member
                const filteredMembers = members.filter(member => member._id !== user._id);

                // setting the groupsMembers
                setGroupMembers(filteredMembers);
            
                let filteredFriends;
                if(filteredMembers.length <= 0 ){
                    filteredFriends = friends;
                }
                else {
                    filteredFriends = friends.filter(friend => !filteredMembers.some(member => member._id === friend._id))
                }
                // setting filtered friends
                setFriendsArray(filteredFriends)

            }catch(error){
                console.log(error)
            }   
       }

        showGroupMemberHandler();
        // eslint-disable-next-line
    },[mounted])


    //Functions
    async function addFriendToFriendsList(_id,actionName){
        const token = Token.getLocalStorageData('splitzoneToken');

        switch(actionName){
            case "removeMember":
                try{    

                        /* Member to be removed*/
                        const member = groupMembers.filter(member => member._id === _id)[0];
                        const removeMemberResponse = await fetch(`${serverURI}/api/app/group/${groupID}/${_id}`, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ token
                            },
                            body: JSON.stringify(member)
                        })

                        if(removeMemberResponse.status !== 200){
                                console.log("some thing went wrong/// find that in catch statement")
                                return 
                        }   
                        setMounted (false)
                }
                catch(error){
                    console.log(error)
                }

            break;

            
            case "addMember":
                const filteredFriend = friendsArray.filter(friend => friend._id === _id)
                try{
                        const addMemberResponse = await fetch(`${serverURI}/api/app/group/${groupID}`, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ token
                            },
                            body: JSON.stringify({members : filteredFriend})
                        })
                        if(addMemberResponse.status !== 200){
                                console.log("some thing went wrong/// find that in catch statement")
                                return 
                        }
                        setMounted (false)
                }
                catch(error){
                    console.log(error)
                }               
                break;

            default:
                return 
            
        }
    }

    return (
        <div className = "B_editRemoveMembersC">
            <ul ref = {editRemoveInnerRef}>
                {groupMembers && groupMembers.map(member => {
                    return (
                        <li className = "B_ERList" key = {member._id}>
                            <p>{member.name}</p>

                            {/* if email exists show else option for adding an email */}
                            {(member.email && member.email.length > 0) ? 
                                <p>{member.email}</p> :
                                <button>Add Email</button>
                            }
                            <button onClick = {(e) => {addFriendToFriendsList(member._id, "removeMember")}}>remove</button>
                        </li>
                    )
                })}

                {friendsArray && friendsArray.map(friend => {
                    return (
                        <li className = "B_ERList" key = {friend._id}>
                            <p>{friend.name}</p>
                            {/* if email exists show else option for adding an email */}
                            {(friend.email && friend.email.length > 0) ? 
                                //------- based on friend registered or not show invite
                                <p>{friend.email}</p> :
                                <button>Add Email</button>
                            }
                           <button onClick = {(e) => {addFriendToFriendsList(friend._id, "addMember")}}>Add</button>
                        </li>
                    )
                })}


            </ul>
        </div>
    )
} // END of EditRemoveMembers*//
