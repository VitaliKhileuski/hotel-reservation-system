import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'
export default function AuthRoute({component,path,exact,requiredRoles}){
        
    const isAuthed = !!localStorage.getItem("token");
    const role = useSelector((state) => state.role);
    const userHasRequireRole = requiredRoles.includes(role);

    return (
        <Route
        exact = {exact}
        path = {path}
    ></Route>
    );
}