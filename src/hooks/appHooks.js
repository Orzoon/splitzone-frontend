import React, {useEffect, useState} from "react";


function useBillSubmitForm(initialValues){
    const [values, setValues] = useState(initialValues);
    // setting values
    console.log("values", values)
    function handleBillFormChange(e){
        console.log("formHandlerValue",e.target.value)
    }

    function handleBillFormSubmit(values){
        console.log(values)
    }

    return {values, handleBillFormChange, handleBillFormSubmit}
}


export {useBillSubmitForm}