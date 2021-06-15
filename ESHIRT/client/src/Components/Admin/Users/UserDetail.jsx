import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { putUser, getUserById } from "../../../Actions/index.js";
import {NavLink} from 'react-router-dom';
import Style from "./UserDetail.module.css";
import {useTokenDecode} from '../../../hooks/tokenDecoding';
import {useHistory} from 'react-router-dom';
import ErrorNoAdminPage from '../ErrorPages/ErrorNoAdmin';
import swal from 'sweetalert';

export default function UserDetail ({match}){

    const [edit, setEdit] = useState(false);
    const [dataToModify, setDataToModify] = useState({});
    const user = useSelector((state) => state.userReducer.userId);
    const dispatch = useDispatch();
    const isAdmin = useTokenDecode(localStorage.currentToken);
    const history = useHistory();

    useEffect(() => {
        if (parseInt(user.id) !== parseInt(match.params.id)) {
            dispatch(getUserById(match.params.id))
        };
    });
    
    function validateDataToModify () {
        const result = {}
        for (const field in dataToModify) {
            if (dataToModify[field]) {
                if (field === 'phone') {
                    result[field] = parseInt(dataToModify[field])    
                };
                result[field] = dataToModify[field]
            };
        };
        return result;
    };
    
    function handleChange (e) {
        e.preventDefault();
        setDataToModify(
            {
                ...dataToModify, 
                [e.target.name]: e.target.value
            }
        );
    };

    function handleSubmit (e) {
        e.preventDefault();
        dispatch(putUser(validateDataToModify(dataToModify), user.id))
        swal({ 
            title: "DONE", 
            text: "User modified",
            icon: "success",
            timer: 2000,
            padding: "0.75rem"
            });
        history.push('/users')
    };

    function handleClick(e) {
        e.preventDefault();
        setEdit(!edit)
    };

    function showEditInput (fieldToEdit){
        return (
            isAdmin === null ? 'LOADING' : isAdmin === false ? (<ErrorNoAdminPage />) : 
        <div className={Style.edit}>
            <input  type= "text" name={fieldToEdit} onChange={(e) => handleChange(e)}></input>
        </div>
        );
    };

    function setDataToDisplay () {
        const fields = ['name', 'lastname', 'email', 'country', 'city', 'adress', 'phone'];
        return (
            <div className={Style.Tarjet}>
                {fields.map(field => {
                    return (
                        <div className={Style.field} key={user[field]}>
                            <p className={Style.Centers}>{field}: {user[field]} {edit && showEditInput(field)}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={Style.Title}>
            <form onSubmit={handleSubmit} className={Style.form}>
                    <h2 className={Style.Detail}>User detail</h2>
                    {setDataToDisplay()}
                    <div >                    
                        <button className={Style.Submit} onClick={handleClick}> Edit </button>
                    </div>
                {edit && <input className={Style.Submit} type='submit' ></input>}
            </form>
            <div className={Style.nav}>
                <NavLink to='/users'>
                    <h4 className={Style.Btn3}>USERS</h4>
                </NavLink>
                <NavLink to='/admins'>
                    <h4 className={Style.Btn3}>ADMINISTRATORS</h4>
                </NavLink>
                <NavLink to='/home_admin'>
                    <h4 className={Style.Btn3}>CONTROL PANEL</h4>
                </NavLink>
            </div>
        </div>
    );
};