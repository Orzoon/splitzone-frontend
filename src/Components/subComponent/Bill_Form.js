import React, {useEffect, useState, useContext} from "react";
import {useHistory} from 'react-router-dom';
import Token from "../../helpers/token";
import {serverURI} from "../../helpers/GlobalVar";
import {AppUserContext} from "../App/App"
import {useBillSubmitForm} from "../../hooks/appHooks";

export default function BillForm(props){
    const history = useHistory();
    const user = useContext(AppUserContext);
    const {groupID} = props;
    const [groupMembers, setGroupMembers] = useState(null);
    const [splitAmongB, setSplitAmongB] = useState(false);
    const [errors, setErrors] = useState({});
    // setting initialValues if groupmembers exist

    let [initialValues, setInitialValues] = useState(null)
    /*---------------*/
    //--------> moving and setting everything within first useEffect
    // form hook

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

                    /* ---------------
                        setting initialArray to pass dowm to the next component
                    */
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
                    setInitialValues(tempInitialValues)
                    
                }
        }
        catch(error){
            console.log(error)
        }
        }

        fetchGroupMembersData();
    }, [])

  
    /* --based on this OPEN/CLOSE splitView */
    function splitAmongBHandler(e){
        e.preventDefault();
        setSplitAmongB(!splitAmongB)
    }

    function handleRemoveAddBillMembers(e,_id, action){
        if(e){
            e.preventDefault();
        }
        // removing initial values
        if(action === "remove"){
            const copy = [...initialValues.splittedAmongMembers];
            const copyFiltered = copy.filter(m_id => m_id !== _id);
            const tempLength = copyFiltered.length;
            // setting initial values and the length
            let customObj = {};
            if(user._id === _id){
                customObj.incExc = "excluding"
            }
            else {
                customObj = {...initialValues.customObj}
            }
            setInitialValues({...initialValues,  splittedAmongMembers: copyFiltered, splittedAmongNumber: tempLength, customObj: customObj})
        }
        if(action === "add"){
            const newCopy = [...initialValues.splittedAmongMembers, _id];
            const tempLength = newCopy.length;
            // setting initial values and the length
            let customObj = {};
            if(user._id === _id){
                customObj.incExc = "including"
            }
            else {
                customObj = {...initialValues.customObj}
            }
            setInitialValues({...initialValues,  splittedAmongMembers: newCopy, splittedAmongNumber: tempLength, customObj: customObj})
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
                const paidByName = groupMembers.filter(member => member._id === paidById);
                const paidBy = {
                    _id: paidByName[0]._id,
                    name:paidByName[0].name
                } 
                setInitialValues({...initialValues,paidBy: paidBy})
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
                    divided = [...initialValues.divided]
                }
                setInitialValues({...initialValues, dividedEqually: trueFalse, divided: divided})
                break;
            case "divided":
                let Amount = e.target.value.trim();
                let regEx = /^\d*\.?\d{0,2}$/;
                if(!Amount.match(regEx)){
                    errorHandler("amountValueError", "Entered Amount must be a number")
                    return false
                }
              
                // if(isNaN(AmountValue)){
                //     errorHandler("amountValueError", "Entered Amount must be a number")
                //     return false
                // }
                if( Object.keys(errors).length > 0 ){
                    if( errors.hasOwnProperty("amountValueError")){
                        const errorsCopy = {...errors};
                        delete errorsCopy.amountValueError;
                        setErrors(errorsCopy)
                    }
                }
                let  dividedCopy = [...initialValues.divided]
                const dataExists = dividedCopy.filter(member => member._id === _id);
                if( dataExists.length > 0){
                    const filtredArray = dividedCopy.filter(member => member._id !== _id);
                    const oldObj = dataExists[0];
                    oldObj.amount = Amount;
                    setInitialValues({...initialValues, divided: [...filtredArray, oldObj]})
                }
                else {
                    const name = groupMembers.filter(member => member._id === _id)[0].name;
                    const copyArray = [...initialValues.divided]
                    const newObj = {
                        _id: _id,
                        name: name,
                        amount: Amount
                    }
                    copyArray.push(newObj)
                    setInitialValues({...initialValues, divided: copyArray})
                }
                break;
            default: 
            const amount = e.target.value.trim();
            setInitialValues({...initialValues,paidAmount: Number(amount)})

        }
    }

    function errorHandler(errorname, error){
        setErrors({...errors, [errorname]: error})
    }


    function submitBillFormHandler(e){
        e.preventDefault();
        const valuesCopy = {...initialValues}
        valuesCopy.paidCategory= "some category for now";
        valuesCopy.ownerGroup = groupID;
        valuesCopy.paidDate = "somedate";
        // deleting customCopy
        delete valuesCopy.customObj;
        
        // validate here

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

                if(Billsresponse.status !== 200){

                    // setErrors
                    return false
                }
                // cosing the bill form
                props.showBillFormToggleHandler()
                console.log("bill added")
                history.push("/temp");
                history.goBack();

            

            }catch(error){
                console.log(error)
            }
        }
        sendBillFormData();
    }
    return (
        <div className = "Bill_Form_Container">
            <form className = "Bill_Form"  id = "Bill_Form" onSubmit={(e) => submitBillFormHandler(e)} >
                {/* Form close button */}
                <button  
                    type = "button"
                    onClick = {props.showBillFormToggleHandler}
                    className = "Bill_Form_Close">
                        close
                </button>
                {/* Amount field */}
                <input 
                    name = "Amount"
                    placeholder = "Amount"
                    value = {(initialValues) ? initialValues.paidAmount : " "}
                    onChange = {(e) => handleBillFormChange(e)}
                />    
                <br />
                {/* including/excluding field */}
                <select onChange = { e => handleBillFormChange(e, "incExc")} value = {initialValues ? initialValues.customObj.incExc : "including"}>
                    <option value = "including">including</option>
                    <option value = "excluding">excluding</option>
                </select> you
                <br />
                {/* paidby member */}
                paid by <select onChange = {e => handleBillFormChange(e, "paidBy")}>
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
                <br />
                split 
                <select onChange = {e => handleBillFormChange(e, "eqUneq")} value = {initialValues ? 
                        initialValues.dividedEqually ? "equally" : "unequally"
                        :
                        "equally"
                    }
                >
                    <option value = "equally">equally</option>  
                    <option value = "unequally">unequally</option>  
                </select><br/>
                    
                <br/>among 
                {splitAmongB ? 
                    <SplitAmongBComponent 
                    groupMembers = {groupMembers} 
                    paidAmount = {initialValues.paidAmount}
                    splittedAmongNumber = {initialValues.splittedAmongNumber}
                    splittedAmongMembers = {initialValues.splittedAmongMembers}
                    dividedEqually = {initialValues.dividedEqually}
                    divided = {initialValues.divided}
                    handleRemoveAddBillMembers = {handleRemoveAddBillMembers}
                    handleBillFormChange = {handleBillFormChange}
                    errors = {errors}
                    errorHandler = {errorHandler}
                    /> 
                    : 
                    <input type = "button" value = "all"
                     onClick = {splitAmongBHandler}
                    /> 
                } 

            <input type = "submit" value = "submit"/>
            </form>
        </div>
    )
}

/*-----------------
    splitAmongBComponent
*------------------*/

function SplitAmongBComponent(props){
    /*  
        splittedAmongMembersisanArray
    */
    const user = useContext(AppUserContext);
    const {
        groupMembers, 
        splittedAmongMembers, 
        handleRemoveAddBillMembers, 
        paidAmount, 
        splittedAmongNumber,
        dividedEqually,
        divided,
        handleBillFormChange,
        errorHandler,
        errors 
        }
         = props;

    return (
        <div className = "BF_splitAmongBComponentContainer">

            {
                groupMembers.map(members => {
                        const memberIncludedB = splittedAmongMembers.some(sAMembers => members._id === sAMembers)

                        if(memberIncludedB){
                            return (<div key = {members._id}>
                                        {members.name} 
                                        {dividedEqually ? 
                                            <div>
                                                {(dividedEqually) ? (parseInt(paidAmount, 10)/parseInt(splittedAmongNumber, 10)).toFixed(2) : "not equally" }
                                            </div>
                                            :
                                            <DividedUnequallyInput 
                                                divided = {divided}
                                                members = {members}
                                                handleBillFormChange = {handleBillFormChange}
                                                errors = {errors}
                                                errorHandler = {errorHandler}
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
                            return (<div key = {members._id}> 
                                {members.name} 
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
        return (<input 
            value = { index > -1 ? divided[index].amount : " "} 
            placeholder = "input value" 
            onChange = {e => handleBillFormChange(e, "divided",members._id )}
            />)
    }
