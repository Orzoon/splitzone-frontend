import React, {useState, useEffect, useContext} from 'react';
import {serverURI} from "../../helpers/GlobalVar";
import Token from "../../helpers/token"
import {AppUserContext} from "../App/App"

// ICONS

import {MdAdd} from "react-icons/md"
// scss
import "../../css/Bills.scss";


/*--------------

MAIN BILLS COMPONENT

----------------*/



export default function Bills(props){
    const {groupID} = props.match.params;
    const [isLoading, setisLoading] = useState(true);
    const [group, setGroup] = useState({});
    const [bills, setBills] = useState([]);
    const [errors, setErrors] = useState(null);
    const [showDetails, setShowDetails] = useState(null)


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
            <BillsGroup group = {group}/>
            {/* conditional Details */}
            {showDetails && <BillsGroupDetails hideShowDetails = {HideShowDetailsHandler}/>}
            <BillsFilter/>
            {/* <BillsTitle/> */}
            <BillsComponent bills = {bills}/>
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
   const {group} = props;
    return (
        <div className = "BGContainer">
            <h3>{group.groupName}</h3>
            <button>...</button>
            <p className = "BGCreatedBy"><span>created By: </span><span>{group.createdBy}</span></p>
            <p className = "BGCreatedAt"><span>created At:</span><span>{new Date(group.createdAt).toDateString() }</span></p>
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
 BILLS TITLE
----------------*/








function BillsComponent({bills}){
    return (
        <ul className = "BComponent">
            {bills.map(billItem => {
                console.log(billItem)
                return <ListComponent  key= {billItem._id} bill = {billItem}/>
            })}
        </ul>
    )
}


function ListComponent({bill}){
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
                    {bill.splittedAmongMembers.every(item => item === user._id) && 
                        <p className = "including"><span>including</span> you</p>
                    }
                        <p className = "divided"><span>divided</span> {bill.dividedEqually ? "equally": " "}</p>
                        <p className = "among"><span>among</span> {bill.splittedAmongNumber}</p>
                </li>
                <li className ="BULN_Lentowe">
                    {bill.paidBy._id === user._id && <p className = "lentOwnTitle">you lent</p> }
                    {bill.paidBy._id === user._id &&
                        <p className = "lentOwnAmount">
                            {bill.splittedAmongMembers.every(member => member === user._id) ? 
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
                    {bill.paidBy._id !== user._id && bill.splittedAmongMembers.every(item => item === user._id) && <p className = "lentOwnTitle">you owe</p>}
                    {bill.paidBy._id !== user._id && bill.splittedAmongMembers.every(item => item === user._id) &&
                        <p className = "lentOwnAmount">
                            {bill.dividedEqually ? (bill.paidAmount/bill.splittedAmongNumber).toFixed(2) : bill.divided.find(object => object._id === user._id).amount }
                        </p>
                    }
                </li>
                <li className = "BULN_button">
                    <button className = "deleteBillButton">
                        <MdAdd/>
                    </button>
                </li>
        </ul>
    </li>
)
}