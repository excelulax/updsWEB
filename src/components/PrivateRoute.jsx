import { Outlet, Route, Navigate, useRoutes } from "react-router-dom";
import { useContext } from "react";

const PrivateRoute = ({ isSignedIn, children }) => {

    console.log(isSignedIn);
    if (!isSignedIn) {
        console.log("N");
        return <Navigate to="/login" replace />
    }else{
        console.log("Y");
    }
    return children
};
export default PrivateRoute
