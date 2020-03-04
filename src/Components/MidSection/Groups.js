import React, {useState, useEffect} from 'react';

import {serverURI} from "../../helpers/GlobalVar"
import Token from "../../helpers/token"



// icons
import {MdAddCircleOutline} from "react-icons/md";

import "../../css/Groups.scss";
/*************
 *
 * MAIN GROUP COMPONENT 
 * 
 *************/
export default function Groups(){
    const [isloading, setisLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        async function getGroups(){
            setisLoading(true);
            const token = Token.getLocalStorageData('splitzoneToken');
            try{
                const response = await fetch(`${serverURI}/api/app/groups`, {
                                    method: "GET",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer '+ token
                                    }
                                })
                if(!response.status === 200){
                    // false response
                }
                const data = await response.json();
                setGroups(data)
                console.log(data)
                setError(null)
                setTimeout(() => {
                    setisLoading(false)
                }, 2000)
            }catch(error){
                setError(error)
            }
        }
        getGroups();
    }, [])


    return (
        <div className = "groupsContainer">
            <ul className = "Gul">

                {/* Loading the groupLoader */}
                {isloading && <GroupLoader/>}

                {/* Rest components to show */}
                {!isloading && <li><CreateGroupButton /></li>}
                {!isloading && <GroupList groups = {groups}></GroupList>}
                
            </ul>
        </div>
    )
}



function CreateGroupButton(){
    return(
        <button className = "createGButton">
            <span className = "createGButtonIconC">
                <MdAddCircleOutline/>
            </span>
            <span className = "createGButtonText">Create Group</span>
        </button>
    ) 
}



function GroupLoader(){
    return (
        <React.Fragment>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>

            <li className = "GLoaderSIContainer">
                <div className = "GL_groupName">
                    <div className = "GL_menu"></div>
                    <div className = "GL_dateCreated"></div>
                    <div className = "GL_billsNumber"></div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GL_profileIcons">
                    <div className = "GL_profileIcon GLP_first"></div>
                    <div className = "GL_profileIcon GLP_second"></div>
                </div>
            </li>
        </React.Fragment>
    )


}


function GroupList(props){
    return props.groups.map(groupListItem => {
        const date = new Date(groupListItem.createdAt);
        const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthArray[date.getMonth()];
        const monthDate = date.getDate();
        const membersLength = groupListItem.members.length - 1;
        return(<li className = "GListSIContainer" key = {groupListItem._id}>
                    {/* <div>{groupListItem.createdBy}</div>
                    <div>{groupListItem.members.length}</div> */}
                <div className = "GLi_groupName">
                    <h3>{groupListItem.groupName}</h3>
                    <div className = "GLi_menu"></div>
                    <div className = "GLi_dateCreated">
                        <h3>{monthDate}</h3>
                        <p>{month}</p>
                    </div>
                    <div className = "GLi_billsNumber">
                        <h3>0</h3>
                        <p>Bills</p>
                    </div>
                    {/* <div className = "GL_billsMembers"></div> */}
                </div>
                <div className = "GLi_profileIcons">
                    <img className = "GLi_profileIcon GLIP_first" alt = "creater_image" src = "https://images.pexels.com/photos/3768163/pexels-photo-3768163.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"></img>
                <p className = "GLi_profileIcon GLIP_second">Creator<b>+</b><b>{(membersLength > 0) ? membersLength : 0}</b> others</p>
                </div>
                </li>)
    })
}