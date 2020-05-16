import  React, {
        useState, 
        useEffect, 
        useContext, 
        useRef,
        useReducer
    } 
from 'react';

import {useHistory} from 'react-router-dom';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token"
import {AppUserContext, socketContext, notificationContext} from "../App/App"

// ICONS
import {
    MdAdd,
    MdClose,
    MdKeyboardArrowDown,
    MdCheck,
    MdKeyboardArrowUp
} from "react-icons/md"

// scss
import "../../css/Bills.scss";

// subComponents
import BillForm from '../subComponent/Bill_Form';


// importing Loader
import ComLoader from './ComLoader';

/*--------------

MAIN BILLS COMPONENT

----------------*/
const initialBillState = {
    isLoading: true,
    groupID: null,
    group: null,
    bills: [],
    showSectionDetails: true,
    showEditRemoveMembers: false, 
    showBillForm: false,
    errors: [],

}


const billReducer = (state, action) => {
    switch(action.type){
        case "isLoading":
            return {...state, isLoading: action.payload }
        case "group":
            return {...state, group: action.payload}
        case "bills": 
            return {...state, bills: action.payload}
        case "showSectionDetails":
            return {...state, showSectionDetails: action.payload}
        case "showEditRemoveMembers":
            return {...state, showEditRemoveMembers: action.payload}
        case "showBillForm":
            return {...state, showBillForm: action.payload}
        default: 
            return state;
    }
}

/* MAIN COMPONENT */
export default function Bills(props){
    const notification= useContext(notificationContext);
    const IO = useContext(socketContext)
    const [state, dispatch] = useReducer(billReducer, initialBillState)
    const {groupID} = props.match.params;
    //const [isLoading, setisLoading] = useState(true);
    //const [group, setGroup] = useState({});
    //const [bills, setBills] = useState([]);
    //const [errors, setErrors] = useState(null);
    //const [showDetails, setShowDetails] = useState(true);
    //const [showEditRemoveMembersB,setShowEditRemoveMembersB] = useState(false)
    //const [showBillFormB, setShowBillFormB] = useState(false)
    useEffect(() => { 
        async function getData(groupID){
            if(!groupID){
                // set error
                return null;
            }
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const groupResponse = await fetch(`${serverURI}/api/app/group/${groupID}?bgDetails=${true}`, {
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

                dispatch({type: "group", payload: groupData})
                dispatch({type: "bills", payload: billsData})
                dispatch({type: "showSectionDetails", payload: true});
                dispatch({type: "isLoading", payload: false})
                //
                //setGroup(groupData)
                // setBills(billsData)
                // setShowDetails(true)
                // setisLoading(false)

               
            }catch(error){
               // handle error later on
            }
        }
        getData(groupID);
    },[])

    /* IO EVENTS */
    useEffect(() => {
        // IO.on('S_NotificationCount', () => {
        //     notification.setNotificationCount(prevCount => prevCount + 1)
        // })
    },[])
    /*END OF IOEVENTS */
    function HideShowSectionDetailsHandler(){
            dispatch({type: "showSectionDetails", payload: !state.showSectionDetails})
    }
    function showBillFormToggleHandler(){
        dispatch({type:"showBillForm", payload: !state.showBillForm})
        //setShowBillFormB(!showBillFormB)
    }
    function showEditRemoveMembersHandler(){
        dispatch({type: "showEditRemoveMembers", payload: !state.showEditRemoveMembers})
        //setShowEditRemoveMembersB(!showEditRemoveMembersB)
    }
    function newBillsAdditionHandler(newBillFromForm){
        dispatch({type: "bills", payload: [newBillFromForm, ...state.bills]})
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
                // check for additional error codes
                console.log("error occured")
                return null
            }

            const billsCopy = [...state.bills];
            const filteredBill = billsCopy.filter(bill => bill._id !== billID)
            dispatch({type: "bills", payload: filteredBill})
        }
        catch(error){
            // errors
        }
    }

    if(state.isLoading){
        return <ComLoader />
    }
    else return (
        <div className = "billsContainer">
            <BillsGroup 
                group = {state.group} 
                showEditRemoveMembersHandler = {showEditRemoveMembersHandler} 
                showBillFormToggleHandler = {showBillFormToggleHandler}
                HideShowSectionDetailsHandler = {HideShowSectionDetailsHandler}
                showSectionDetails = {state.showSectionDetails}
                groupCreatedById = {state.group.createdById}
            />
            {/* conditional Details */}
            {state.showSectionDetails && 
                    <BillsGroupDetails 
                        HideShowSectionDetailsHandler = {HideShowSectionDetailsHandler} 
                        showEditRemoveMembersHandler = {showEditRemoveMembersHandler}
                        group = {state.group}
                    />
             }
            
            <BillsSummary 
                bills = {state.bills} 
                groupMembers = {state.group.members}
            />
            {/* Add Bills filter later on */}
            {/* <BillsFilter/> */}
            {/* <BillsTitle/> */}
            <BillsComponent 
                bills = {state.bills}
                removeBillHandler = {removeBillHandler}
            />
            {state.showEditRemoveMembers && <EditRemoveMembers 
                            showEditRemoveMembersHandler = {showEditRemoveMembersHandler} 
                            groupID = {groupID}
                            groupCreatedById = {state.group.createdById}
                            groupMembers = {state.group.members}
                        />}
            {state.showBillForm && <BillForm 
                                showBillFormToggleHandler = {showBillFormToggleHandler}
                                groupID = {groupID}
                                newBillsAdditionHandler ={newBillsAdditionHandler}
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

    function menuToggler(){
        setshowBillsMenu(!showBillsMenu)
    }
    return (
        <div className = "BGContainer">
            <h3>{group.groupName}</h3>
            <button className = "BGMenuBtn" onClick = {(e) => setshowBillsMenu(true)}>...</button>
            <p className = "BGCreatedBy"><span>created By: </span><span>{group.createdBy.replace(group.createdBy.charAt(0), group.createdBy.charAt(0).toUpperCase())}</span></p>
            <p className = "BGCreatedAt"><span>created At: </span><span>{new Date(group.createdAt).toDateString() }</span></p>

            <button className = "BGButton BGFirst">Add a Bill</button>
            <button className = "BGButton BGSecond">Add/Remove Member</button>
            {showBillsMenu && 
                <BillsGroupMenu
                    deleteGroupHandler = {deleteGroupHandler}
                    HideShowSectionDetailsHandler = {props.HideShowSectionDetailsHandler}
                    showBillFormToggleHandler = {props.showBillFormToggleHandler}
                    showEditRemoveMembersHandler = {props.showEditRemoveMembersHandler}
                    menuToggler = {menuToggler}
                    showSectionDetails = {props.showSectionDetails}
                    groupCreatedById = {props.groupCreatedById}
                />
            }
        </div>
    )
}

function BillsGroupMenu(props){
    const billsMenuRef = useRef(null);
    const user = useContext(AppUserContext);
    function outsideUtil(e) {
        if(billsMenuRef.current && !billsMenuRef.current.contains(e.target)){
            props.menuToggler();
        }
    }
    useEffect(() => {
        window.addEventListener("click", outsideUtil, false)

        return (() => {
            window.removeEventListener("click", outsideUtil, false)
        })
    },[])

    return(
        <div className = "showBillsMenu" ref = {billsMenuRef}>
            <div className = "BGEffect"></div>
            <div className = "BGEffect"></div>
            <div className = "BGEffect"></div>
            <div className = "BGEffect"></div>
            <ul>
                <li>
                    <button onClick = {(e) => props.menuToggler()}>Close</button>
                </li>
                <li>
                    <button onClick = {e => {props.showEditRemoveMembersHandler(e);   props.menuToggler()}}>Remove/Add Member</button>
                </li>
                <li>
                    <button onClick = {e => {props.showBillFormToggleHandler();  props.menuToggler()}}>add a bill</button>
                </li>
                <li>
                    <button onClick = {e => {props.HideShowSectionDetailsHandler(); props.menuToggler()}}>{props.showSectionDetails ? "Hide" : "Show"} details</button>
                </li>
                <li>
                    <button>Summary Report</button>
                </li>
                {props.groupCreatedById.toString() === user._id.toString() ? 
                    <li>
                        <button className = "BGDelete" onClick = {props.deleteGroupHandler}>delete Group</button>
                    </li>
                    :
                    null
                }
            </ul>
        </div>
    )
}

function BillsGroupDetails({HideShowSectionDetailsHandler, group}){
   
    return (
        <ul className = "BGDetailsContainer">
            <li>
                <h2>{group && group.bgDetails.totalBills}</h2>
                <h3>Total Bills</h3>
            </li>
            <li>
                <h2>$ {group && group.bgDetails.totalBalance}</h2>
                <h3>Total Balance</h3>
            </li>
            <li>
                <h2>$ {group && group.bgDetails.totalOwe}</h2>
                <h3>You owe</h3>
            </li>
            <li>
                <h2>$ {group && group.bgDetails.totalLent}</h2>
                <h3>You lent</h3>
            </li>
            <button className = "B_closeBGDetails" onClick = {HideShowSectionDetailsHandler}>
                <MdClose />
            </button>
        </ul>
    )
}


/*--------------
 BILLS SUMMARY
----------------*/

function BillsSummary(props){
    const {bills, groupMembers} = props;
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
    const [detailsToggle, setDetailsToggle] = useState(false);
    const user = useContext(AppUserContext);
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'];
    return (
        <li className = "BComponentList" key = {bill._id}>
            <ul className = "BULNested">
                <li className = "BULN_Date">
                    <div className= "month">{monthArray[new Date(bill.createdAt).getMonth()].toUpperCase()} </div>
                    <div className = "day">{new Date(bill.createdAt).getDate()}</div>
                </li>
                <li className = "BULN_PaidBy">
                    <h1>Paid By</h1>
                    <p className = "paidByp">{(user._id === bill.paidBy._id) ? "You" : bill.paidBy.name}</p>
                </li>

                <li className = "BULN_Amount greenColor">
                    <h1 className = "greenColor">Amount</h1>
                    <p className = "amount greenColor">$ {bill.paidAmount}</p>
                </li>
                <li className ="BULN_Lentowe">
                    {bill.paidBy._id === user._id && <h1 className = "lentOwnTitle greenColor">you lent</h1> }
                    {bill.paidBy._id === user._id &&
                        <p className = "lentOwnAmount greenColor">
                            $ {bill.splittedAmongMembers.some(member => member === user._id) ? 
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
                                }, 0)
                            }
                        </p>
                    }
                    {bill.paidBy._id !== user._id && bill.splittedAmongMembers.some(item => item === user._id) && <h1 className = "lentOwnTitle redColor">you owe</h1>}
                    {bill.paidBy._id !== user._id && bill.splittedAmongMembers.some(item => item === user._id) &&
                        <p className = "lentOwnAmount redColor">
                            $ {bill.dividedEqually ? (bill.paidAmount/bill.splittedAmongNumber).toFixed(2) : bill.divided.find(object => object._id === user._id).amount }
                        </p>
                    }
                </li>
                <li className = "BULN_button_show">
                     <h1>Details</h1>
                     <button onClick = {e => setDetailsToggle(prevState => !prevState)}>
                        {detailsToggle ? <MdKeyboardArrowUp/> : <MdKeyboardArrowDown/>}
                     </button>
                </li>
                <li className = "BULN_button_delete">
                    <h1>Delete</h1>
                    <button className = "deleteBillButton" onClick = {(e) => removeBillHandler(bill._id)}>
                        <MdAdd/>
                    </button>
                </li>
            </ul>
            <div className = "BUL_Details" style = {{display: detailsToggle ? "grid": ""}}>
                <div className = "including">
                    <p>Including you</p> 
                    <div  className =   {bill.splittedAmongMembers.some(item => item === user._id) ? "blueBg": "redBg"}>
                        {bill.splittedAmongMembers.some(item => item === user._id) ? <MdCheck />: <MdClose/>}
                    </div>
                </div>
             
                <div className = "divided">
                    <p>Divided Equally</p> 
                    <div className = {bill.dividedEqually ? "greenBg":  "redBg"}>
                       {bill.dividedEqually ? <MdCheck />:  <MdClose/>}
                    </div>
                </div>

                <div className = "among">
                    <p>Among</p>
                    <div className = "blueBg divAmongCircle">
                        {bill.splittedAmongNumber}
                    </div>
                </div>
            </div>     
            {detailsToggle 
                && 
                <div  className = "BUL_DetailsView">
                <ul className = "BDView_commonUl BDView_heading">
                    <li>Member</li>
                    {bill.paidBy._id === user._id ? 
                        <li className = "greenColor">You lent</li>:
                        <li className = "redColor">You owe</li>
                    }
                </ul>

                {/* showing members */}
                {bill && bill.divided.length > 0
                    &&
                    bill.divided.map((item) => {
                        // paid by user /->lent
                        if(bill.paidBy._id.toString() === user._id.toString()){
                            // including user
                            // hiding user UL--showing in footer instead
                            if(item._id.toString() === user._id.toString()){
                                return null
                            }
                            else {
                                return  <ul className = "BDView_commonUl">
                                            <li>{item && item.name.replace(item.name.charAt(0),item.name.charAt(0).toUpperCase())}</li>
                                            <li className = "greenColor">$ {item.amount}</li>
                                        </ul>
                            }
                        }
                        // paid by other 
                        else {
                            if(item._id.toString() === user._id.toString()){
                                return  <ul className = "BDView_commonUl">
                                            <li>{item && item._id.toString() === user._id ? "You" :item.name.replace(item.name.charAt(0),item.name.charAt(0).toUpperCase())}</li>
                                            <li className = "redColor">$ {item.amount}</li>
                                        </ul>
                            }
                            else {
                                return null
                            }
                        }  
                    })
                }

                {/* total UI*/}
                {bill && bill.divided.length > 0
                    &&
                    bill.divided.map((item) => {
                        // paid by user /->lent
                        if(bill.paidBy._id.toString() === user._id.toString()){
                            // including user
                            // hiding user UL--showing in footer instead
                            if(item._id.toString() === user._id.toString()){
                                return  <ul className = "BDView_commonUl BDView_ULYourShare">
                                            <li className = "BDView_LYS blueColor">Your share</li>
                                            <li className = "greenColor">$ {item.amount ? item.amount : "-"}</li>
                                        </ul>
                            }
                            else {
                                return  null
                            }
                        }

                        // paid by other 
                        else {
                            if(item._id.toString() === user._id.toString()){
                                return  null
                            }
                            else {
                                return null
                            }
                        }  
                    })
                }



                <ul className = "BDView_commonUl BDView_footer">

                </ul>

            </div>  
            }
        </li>
)
}

/*--------------
 EditRemoveMembers
----------------*/
function EditRemoveMembers(props){
    const {groupID, showEditRemoveMembersHandler, groupCreatedById} = props;
    const user = useContext(AppUserContext)
    const editRemoveInnerRef = useRef();
    const [friendsArray, setFriendsArray] = useState(null);
    const [groupMembers, setGroupMembers] = useState(null)
    const [mounted, setMounted] = useState(false)

    function outsideclickHandler(e){
        if(editRemoveInnerRef.current && !editRemoveInnerRef.current.contains(e.target)){
            showEditRemoveMembersHandler();
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
                console.log("friendsData", friendsData)
                // checking for empty JUST IN CASE IT WONT CAUSE BUG IN GROUPS FRIENDSLIST
                let friends; 
                if(friendsData.friends &&  friendsData.friends.length > 0 ){
                    friends = friendsData.friends;
                }else {
                    friends = [];
                }

                const members = groupsData.members;
                
                // filtering out the user from the member
                const filteredMembers = members.filter(member => member._id !== user._id);

                // setting the groupsMembers
                //setGroupMembers(filteredMembers);
            
                let filteredFriends;

                /* fixed later */
                /* END OF FIx */
                if(filteredMembers.length <= 0 ){
                    filteredFriends = friends;
                }
                else {
                    filteredFriends = friends.filter(friend => !filteredMembers.some(member => member._id === friend._id))
                }
                if(filteredFriends.length <= 0 && filteredMembers.length <=0){
                    // Later on show the message that groupMembers and firends doesnot exist
                    showEditRemoveMembersHandler();
                }
                // setting filtered friends
                setGroupMembers(filteredMembers);
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
                            <p className = "FriendName">{member.name}</p>

                            {/* if email exists show else option for adding an email */}
                            {(member.email && member.email.length > 0) ? 
                                <p className = "FriendOption">{member.email}</p> :
                                <button className = "FriendOption emailBtn">Add Email +</button>
                            }
                           {member._id.toString() === groupCreatedById.toString() ? 
                                null: 
                                <button  className = "optionButton" onClick = {(e) => {addFriendToFriendsList(member._id, "removeMember")}}>remove</button>}
                        </li>
                    )
                })}

                {friendsArray && friendsArray.map(friend => {
                    return (
                        <li className = "B_ERList" key = {friend._id} style = {{backgroundColor: 'rgb(224, 217, 217)'}}>
                            <p className = "FriendName">{friend.name}</p>
                            {/* if email exists show else option for adding an email */}
                            {(friend.email && friend.email.length > 0) ? 
                                //------- based on friend registered or not show invite
                                <p className = "FriendOption">{friend.email}</p> :
                                <button className = "FriendOption emailBtn">Add Email +</button>
                            }
                           <button className = "optionButton" onClick = {(e) => {addFriendToFriendsList(friend._id, "addMember")}}>Add</button>
                        </li>
                    )
                })}


            </ul>
        </div>
    )
} // END of EditRemoveMembers*//
