import React, {useEffect, useState, useContext, useRef, useReducer} from "react";
import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
import {AppUserContext} from "../App/App"
import {MdAnnouncement, MdKeyboardArrowUp, MdClose} from "react-icons/md"
import {AiFillDollarCircle} from "react-icons/ai"
import { IconContext } from "react-icons";



function billReducer(state, action){
    switch(action.type){
        case "setErrors":
           return {...state, errors: action.payload}
        case "setGroupMembers":
            return {...state, groupMembers: action.payload}
        case "initialValues":
            return {...state, initialValues: action.payload}
        case "showSplitAmongDropDown":
            return {...state, showSplitAmongDropDown: action.payload}
        case "btnSubmit":
            return{...state, btnSubmit: action.payload}
        default:
            return state
    }
}



const billFormInitialState = {
    groupMembers: null,
    initialValues: null,
    showSplitAmongDropDown: false,
    errors: {},
    btnSubmit : false
}

export default function BillForm(props){
    const [state, dispatch] = useReducer(billReducer, billFormInitialState);
    const BillFormRef = useRef(null);
    const user = useContext(AppUserContext);
    const {groupID,newBillsAdditionHandler} = props;

    // Check for errors ErrorComponent
    const [noMember, setNomember] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    // const [groupMembers, setGroupMembers] = useState(null);
    // const [splitAmongB, setSplitAmongB] = useState(false);
    // const [errors, setErrors] = useState(null);
    // let [initialValues, setInitialValues] = useState(null)

    useEffect(() => {
        // setting errors to null on loading
        dispatch({type:"setErrors", payload: {}})
        dispatch({type:"btnSubmit", payload: false})

        // set propsValues in the firstPlace
        async function fetchGroupMembersData(){
            try{
                const token = Token.getLocalStorageData('splitzoneToken');
                const groupMemberResponse = await fetch(`${serverURI}/api/app/group/${groupID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                })
                if(!groupMemberResponse.ok){
                       const errorData = await groupMemberResponse.json()
                       throw(errorData)
                }   
                const groupData = await groupMemberResponse.json();

                // if groupMembers.length is not greater than 1 throw error [ErrorMsessage]
                if(groupData.members.length <= 1){
                    // let errorObj = {}
                    // errorObj.NoMember = "Add your friends to the group as a member before adding a bill";
                    setNomember(true)
                    setErrorMessage("Add your friends to the group as a member before adding a bill")
                    return
                }

                // setting groupMembers
                dispatch({type:"setGroupMembers", payload: groupData.members})
                setNomember(false)
                /* setting initialArray to pass dowm to the next component */
                const tempGroupMembers = groupData.members;
                const tempArr = [];
                const gM = tempGroupMembers.forEach(member => tempArr.push(member._id))
                const tempInitialValues = {
                    paidBy: {
                        _id: user._id,
                        name: user.username
                    },
                    addedBy:{
                        _id: user._id,
                        name: user.username
                    },
                    paidAmount: null,
                    splittedAmongNumber: tempArr.length,
                    //paid date
                    dividedEqually: 1,
                    splittedAmongMembers: tempArr,
                    divided: [],
                    customObj: {
                        incExc: "including"
                    }
                }
                // setting initial Values
                dispatch({type:"initialValues", payload: tempInitialValues})
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
                // errors got while inititing the component not while submission
                dispatch({type: "setFormErros", payload: errorObj})
            }
        }

        fetchGroupMembersData();
        window.addEventListener('click', outsideUtil, false);
        return (() => {
            window.removeEventListener('click', outsideUtil, false)
        })
    }, [])

    function outsideUtil(e){
        if(BillFormRef.current && !BillFormRef.current.contains(e.target)){
            //props.showBillFormToggleHandler();
        }
    }
    /* --based on this OPEN/CLOSE splitView */
    function splitAmongBHandler(e){
        e.preventDefault();
        dispatch({type:"showSplitAmongDropDown", payload: !state.showSplitAmongDropDown})
    }// fixed
    function handleRemoveAddBillMembers(e,_id, action){
        if(e){
            e.preventDefault();
        }
        // removing initial values
        if(action === "remove"){
            const copy = [...state.initialValues.splittedAmongMembers];
            const copyFiltered = copy.filter(m_id => m_id !== _id);
            const tempLength = copyFiltered.length;
            // setting initial values and the length
            let customObj = {};
            if(user._id === _id){
                customObj.incExc = "excluding"
            }
            else {
                customObj = {...state.initialValues.customObj}
            }

            // setting overAll initialValues 
            dispatch({type:"initialValues", payload: {...state.initialValues,  splittedAmongMembers: copyFiltered, splittedAmongNumber: tempLength, customObj: customObj}})
            // setInitialValues({...initialValues,  splittedAmongMembers: copyFiltered, splittedAmongNumber: tempLength, customObj: customObj})
        }
        if(action === "add"){
            const newCopy = [...state.initialValues.splittedAmongMembers, _id];
            const tempLength = newCopy.length;
            // setting initial values and the length
            let customObj = {};
            if(user._id === _id){
                customObj.incExc = "including"
            }
            else {
                customObj = {...state.initialValues.customObj}
            }
            dispatch({type:"initialValues", payload:{...state.initialValues,  splittedAmongMembers: newCopy, splittedAmongNumber: tempLength, customObj: customObj}})
            //setInitialValues({...initialValues,  splittedAmongMembers: newCopy, splittedAmongNumber: tempLength, customObj: customObj})
        }
    }

    function handleBillFormChange(e, action, _id){
        switch(action){
            case "incExc":
                if(e.target.value === "excluding"){
                    handleRemoveAddBillMembers(null,user._id, "remove")
                }else{
                    handleRemoveAddBillMembers(null,user._id, "add")
                }
                break;
            case "paidBy":
                const paidById = e.target.value;
                const paidByName = state.groupMembers.filter(member => member._id === paidById);
                const paidBy = {
                    _id: paidByName[0]._id,
                    name:paidByName[0].name
                } 
                console.log("paidBy", paidBy)
                dispatch({type:"initialValues", payload:{...state.initialValues,paidBy: paidBy}})
                //setInitialValues({...initialValues,paidBy: paidBy})
                break;
            case "eqUneq":
                const value = e.target.value;
                let trueFalse;
                let divided = []
                if(value === "equally"){
                    trueFalse = 1
                    divided = []
                }
                else {
                    trueFalse = 0
                    divided = [...state.initialValues.divided]
                }
                dispatch({type:"initialValues", payload:{...state.initialValues, dividedEqually: trueFalse, divided: divided}})
                //setInitialValues({...initialValues, dividedEqually: trueFalse, divided: divided})
                break;
            case "divided":
                let Amount = e.target.value.trim();
                // let regEx = /^\d*\.?\d{0,2}$/;
                let  dividedCopy = [...state.initialValues.divided]
                const dataExists = dividedCopy.filter(member => member._id === _id);
                if( dataExists.length > 0){
                    const filtredArray = dividedCopy.filter(member => member._id !== _id);
                    const oldObj = dataExists[0];
                    oldObj.amount = Amount;
                    dispatch({type:"initialValues", payload:{...state.initialValues, divided: [...filtredArray, oldObj]}})
                    // setInitialValues({...initialValues, divided: [...filtredArray, oldObj]})
                }
                else {
                    const name = state.groupMembers.filter(member => member._id === _id)[0].name;
                    const copyArray = [...state.initialValues.divided]
                    const newObj = {
                        _id: _id,
                        name: name,
                        amount: Amount
                    }
                    copyArray.push(newObj)
                    dispatch({type:"initialValues", payload:{...state.initialValues, divided: copyArray}})
                    //setInitialValues({...initialValues, divided: copyArray})
                }
                break;
            default: 
            let amount = e.target.value.trim();
            dispatch({type:"initialValues", payload:{...state.initialValues,paidAmount: amount}})
            if(Number(amount) < 0 || !Number(amount)){
                dispatch({type:"showSplitAmongDropDown", payload: false})
            }
        }
    }

    function submitBillFormHandler(e){
        e.preventDefault();
        dispatch({type:"setErrors", payload: {}});
        dispatch({type:"btnSubmit", payload: true})
      
        const valuesCopy = {...state.initialValues}
        /* Values to be set made available later*/
        valuesCopy.paidCategory= "some category for now";
        valuesCopy.ownerGroup = groupID;
        valuesCopy.paidDate = "somedate";

        // deleting customCopy
        delete valuesCopy.customObj;
        let errorObj = {}
        /* some validation */
        // checking the amount type
        if(!Number(valuesCopy.paidAmount)){
           errorObj.amountError = "Amount must be a number"
        }

        // if divided unequally check the sum
        if(!valuesCopy.dividedEqually){
           const dividedArrayCopy = [...valuesCopy.divided]
           if (dividedArrayCopy.length <=0){
               errorObj.divided = "You forgot to split the amount"
           }
           if(dividedArrayCopy.length === 1){
                if(dividedArrayCopy[0]._id.toString() === user._id.toString()){
                    errorObj.useronly = "You cannot split to yourself only"
                }
           }
           // number check
           if(dividedArrayCopy.length >= 1){
                const lengthCheck = dividedArrayCopy.every(item => {
                    if(item.amount.trim().length <=0){
                        return false
                    }
                    else{
                        return true
                    }
                })

                if(!lengthCheck){
                    errorObj.amountInput = "You forgot to split the amount"
                }
               // Number check
               const allNumber = dividedArrayCopy.every(item => {
                    if(Number(item.amount)){
                        return true
                    }
                    else{
                        return false
                    }
                })
               if(!allNumber){
                errorObj.amountError = "Amount must be a number"
               }
                // sumCheck
               if(allNumber && Number(valuesCopy.paidAmount)){
                    const total = dividedArrayCopy.reduce((sum, item) => {
                        const amount = item.amount;
                        sum = sum + Number(amount)
                        return sum
                    },0)
                    if(total !== Number(valuesCopy.paidAmount)){
                        errorObj.sumError = "Sum of splitted amount must be equal to total amount"
                    }
               } 
           }
        }
        if(Object.keys(errorObj).length > 0){
            dispatch({type:"btnSubmit", payload: false})
            dispatch({type:"setErrors", payload: errorObj});
            return 
        }
        /* IF ANY ERRORS */
        /* END OF CHECK *?
        // REST IMPLEMENT ON SERVER
        /* NOTE Added divided info even for split here */
        /* this is for the INFO --> NOTE ---> to make iteration extendable*/
        if(valuesCopy.dividedEqually) {
            const groupMembersCopy = [...state.groupMembers];
            const splittedAmongMembersCopy = [...valuesCopy.splittedAmongMembers];
            const splittedAmongNo = splittedAmongMembersCopy.length;

            const dividedArray = [];

            splittedAmongMembersCopy.forEach(id => {
                const member = groupMembersCopy.filter(member => member._id.toString() === id);
                dividedArray.push(
                    {
                        amount : +(valuesCopy.paidAmount/ splittedAmongNo).toFixed(2),
                        _id: id,
                        name: member[0].name
                    }
                )
            })

            // setting values
            valuesCopy.divided = dividedArray
        }
        
        // sending data
        const token = Token.getLocalStorageData('splitzoneToken');

        async function sendBillFormData(){
            try{
                const Billsresponse = await fetch(`${serverURI}/api/app/bill/${groupID}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify(valuesCopy)
                })

                if(!Billsresponse.ok){
                    const errorData = await Billsresponse.json();
                    throw(errorData)
                }
                // cosing the bill form
                const addedBill = await Billsresponse.json();
                newBillsAdditionHandler(addedBill);
                props.showBillFormToggleHandler();
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
                // setting errors
                dispatch({type:"setErrors", payload: errorObj});
                dispatch({type:"btnSubmit", payload: false})
            }
        }
        sendBillFormData();
    }
    return (
        <div className = "Bill_Form_Container" >

            {noMember &&
                <NoMemberComponent message = {errorMessage} closeHandler = {props.showBillFormToggleHandler}/>
            }
            { !noMember &&
            <form className = "Bill_Form"  ref = {BillFormRef} id = "Bill_Form" onSubmit={(e) => submitBillFormHandler(e)} >
                {/* Form close button */}
                <button  
                    type = "button"
                    onClick = {props.showBillFormToggleHandler}
                    className = "Bill_Form_Close">
                     <MdClose />
                </button>

                <h1 className = "formTitle">Add a bill</h1>

                {/* SHOWING ALL THE FORM ERRORS ON THE TOP */}        
                {/* AMOUNT ERROR */}
                {state.errors && state.errors.amountError && <p className = "error">{state.errors.amountError}</p>}
                {state.errors && state.errors.divided && <p  className = "error">{state.errors.divided}</p>}
                {state.errors && state.errors.useronly && <p  className = "error">{state.errors.useronly}</p>}
                {state.errors && state.errors.amountInput && <p  className = "error">{state.errors.amountInput}</p>}
                {state.errors && state.errors.sumError && <p  className = "error">{state.errors.sumError}</p>}
                {/* Amount field */}
                <div className = "commonF_div">
                    <input 
                        type = "number"
                        className = "Amount"
                        name = "Amount"
                        placeholder = "Enter Amount"
                        value = {(state.initialValues) ? state.initialValues.paidAmount : ""}
                        onChange = {(e) => handleBillFormChange(e)}
                    />   
                        <IconContext.Provider value={{ color: "#2DB177"}}>
                            <AiFillDollarCircle/>
                        </IconContext.Provider>                    
                </div>  
              

                {/* including/excluding field */}
                <div className = "commonF_div">
                    <select onChange = { e => handleBillFormChange(e, "incExc")} value = {state.initialValues ? state.initialValues.customObj.incExc : "including"}>
                        <option value = "including">including</option>
                        <option value = "excluding">excluding</option>
                    </select> 
                    <h1>you</h1>
                </div>

                {/* paidby member */}
                <div className = "commonF_div">
                    <h1>Paid by</h1>
                    <select onChange = {e => handleBillFormChange(e, "paidBy")}>
                            {state.groupMembers && 
                                state.groupMembers.map(member => {
                                    if(member._id === user._id){
                                        return <option key = {member._id} value = {member._id} defaultChecked>You</option>
                                    }
                                    else {
                                        return <option key = {member._id} value = {member._id}>{member.name}</option>
                                    }
                                })
                            }
                        </select>
                </div>
                <div className = "commonF_div">
                    <h1>Split</h1>
                    <select onChange = {e => handleBillFormChange(e, "eqUneq")} value = {state.initialValues ? 
                            state.initialValues.dividedEqually ? "equally" : "unequally"
                            :
                            "equally"
                            }
                        >
                        <option value = "equally">equally</option>  
                        <option value = "unequally">unequally</option>  
                    </select>
                </div>              
                <div id = {state.showSplitAmongDropDown ? "splittedAmongParentDivFix":"splittedAmongParentDivFixFirstParent"} >
                    {state.initialValues && console.log(Number(state.initialValues.paidAmount))}
                    {/* SHOWING _ ENTER AMOUNT FOR ADDITIONAL OPTIONS BASED ON THE AMOUNT VALUE */}
                    {   state.initialValues && 
                        (state.initialValues.hasOwnProperty('paidAmount') && Number(state.initialValues.paidAmount) > 0) &&
                        <h1>Among</h1>
                    }
                    {   state.initialValues && 
                        (state.initialValues.hasOwnProperty('paidAmount') && Number(state.initialValues.paidAmount) > 0) &&
                        <button className = "FormButton" type = "button" 
                            onClick = {splitAmongBHandler}
                        >
                            {state.showSplitAmongDropDown ? <MdKeyboardArrowUp/> : "all"}
                        </button>
                    }
                    {(state.initialValues && (state.initialValues.hasOwnProperty('paidAmount') && Number(state.initialValues.paidAmount) > 0)) ?
                        null :
                        <h1 className = "FormShowAllRestriction">
                            <MdAnnouncement />
                            <p>Enter Amount for more options</p>
                        </h1>
                    }
                    {/* Showing show all form below */}
                    {
                    (state.initialValues && Number(state.initialValues.paidAmount) > 0 && state.showSplitAmongDropDown) ? 
                        <SplitAmongComponent 
                            groupMembers = {state.groupMembers} 
                            paidAmount = {state.initialValues.paidAmount}
                            splittedAmongNumber = {state.initialValues.splittedAmongNumber}
                            splittedAmongMembers = {state.initialValues.splittedAmongMembers}
                            dividedEqually = {state.initialValues.dividedEqually}
                            divided = {state.initialValues.divided}
                            handleRemoveAddBillMembers = {handleRemoveAddBillMembers}
                            handleBillFormChange = {handleBillFormChange}
                            errors = {state.errors}
                        /> 
                        : null
                    } 
                </div>
                <div className = "commonF_div">
                     <input className = "FormButton" type = "submit" value = "submit"/>
                </div>
                </form> }
        </div>
    )
}
/*-----------------
    splitAmongBComponent
*------------------*/

function SplitAmongComponent({
    groupMembers,
    paidAmount,
    splittedAmongNumber,
    splittedAmongMembers,
    dividedEqually,
    divided,
    handleRemoveAddBillMembers,
    handleBillFormChange,
    errors,
    }){
    /* splittedAmongMembersisanArray */
    const user = useContext(AppUserContext);

    return (
        <div className = "BF_splitAmongBComponentContainer">
            {
                groupMembers.map(members => {
                        const memberIncludedB = splittedAmongMembers.some(sAMembers => members._id === sAMembers)
                        if(memberIncludedB){
                            return (<div key = {members._id} className = "F_List">
                                        <h1>{members._id.toString() === user._id.toString() ? "you": members.name} </h1>
                                        {dividedEqually ? 
                                            <div className = "Form_amount">
                                                {(dividedEqually && paidAmount) ? "$" + (parseInt(paidAmount, 10)/parseInt(splittedAmongNumber, 10)).toFixed(2) : "not equally" }
                                            </div>
                                            :
                                            <DividedUnequallyInput 
                                                divided = {divided}
                                                members = {members}
                                                handleBillFormChange = {handleBillFormChange}
                                                errors = {errors}
                                                paidAmount = {paidAmount}
                                            />  
                                        }
                                        <button 
                                            onClick = {(e) => handleRemoveAddBillMembers(e,members._id, "remove")} >
                                                exclude
                                        </button>
                                    </div>)
                        }
                        else {
                            return (<div key = {members._id}  className = "F_List"> 
                                <h1>{members.name} </h1>
                                <button 
                                onClick = {(e) => handleRemoveAddBillMembers(e,members._id, "add")} >
                                        include
                                </button>
                            </div>)
                        }
                })
            }
        </div>
    )
}

function DividedUnequallyInput({
    divided, 
    members, 
    handleBillFormChange, 
    errors, 
    errorHandler,
    paidAmount
    })
    {   
        const index = divided.findIndex(member => member._id === members._id)
        let amount = ""
        if(index > -1){
            amount = divided[index].amount;
        
        }
        return (<input className = "input_amount"
            value = {amount} 
            placeholder = "$" 
            onChange = {e => handleBillFormChange(e, "divided",members._id )}
            />)
}


function NoMemberComponent({message, closeHandler}){
    return(
        <div className = "No_Member">
            <h1>oops!</h1>
            <p>{message}</p>
            <button onClick = {e => closeHandler()}>
                close
            </button>
        </div>
    )
}
