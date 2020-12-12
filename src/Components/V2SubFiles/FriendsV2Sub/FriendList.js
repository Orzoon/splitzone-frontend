import React from "react";

// style file
import "../../../css/V2SubFiles/FriendsV2Sub/FriendList.scss";


export default function  FriendList(){
    return (
        <>
            <li className = "FV2_listHeading">
                <h2></h2>
                <h2>Name</h2>
                <h2>Amount</h2>
                <h2>Details</h2>
            </li>

            <li>    
                    <div className = "member"></div>
                    <div className="nameContainer">
                        <div className = "profileImageContainer">
                            <img src = "https://cdn.pixabay.com/photo/2015/09/02/12/58/woman-918788_1280.jpg"></img>
                        </div>
                        <h1>Arjun Kunwar</h1>
                        <h2>22 Aug 2018</h2>
                    </div>
                    {/* <div className = "email">
                            <h1>orzoonkunwar7.ak@gmail.com</h1>
                    </div> */}

                    <div className = "amount">
                        <h1>+ $45</h1>
                        <h2>You lent</h2>
                        <div className = "amountIcon">
                        </div>
                    </div>

                    <button class="FV2_viewDetails">
                        View
                    </button>
            </li>

            <li>    
                    <div className = "member"></div>
                    <div className="nameContainer">
                        <div className = "profileImageContainer">
                            <h1>KA</h1>
                        </div>
                        <h1>Kunwar Arjun</h1>
                        <h2>22 Aug 2018</h2>
                    </div>
                    {/* <div className = "email">
                            <h1>orzoonkunwar7.ak@gmail.com</h1>
                    </div> */}

                    <div className = "amount">
                        <h1>- $45</h1>
                        <h2>You owe</h2>
                        <div className = "amountIcon">
                        </div>
                    </div>

                    <button class="FV2_viewDetails">
                        View
                    </button>
            </li>
        </>
    )
}