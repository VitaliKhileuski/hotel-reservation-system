import { React } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./../components/Authorization/Login";
import Register from "./../components/Authorization/Register";
import Home from "./../components/Home";
import HotelTable from "./../components/Hotel/HotelTable";
import HotelEditor from "./../components/Hotel/HotelEditor";
import RoomsPage from "./../components/Room/RoomsPage";
import OrderTable from "./../components/Reservation/OrderTable";
import UserProfile from "./../components/User/UserProfile";
import UserTable from "../components/User/UserTable";
import AuthRoute from "./../Routing/AuthRoute";
import RoomPage from "./../components/Room/RoomPage";
import { ADMIN, HOTEL_ADMIN } from "./../config/Roles";

export default function RouterList() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/rooms" render={(props) => <RoomsPage {...props} />} />
      <Route path="/roomDetails" render={(props) => <RoomPage {...props} />} />
      <AuthRoute
        path="/ownedHotels"
        Component={HotelTable}
        requiredRoles={[ADMIN, HOTEL_ADMIN]}
      ></AuthRoute>
      <AuthRoute path="/orders" Component={OrderTable}></AuthRoute>
      <AuthRoute path="/userProfile" Component={UserProfile}></AuthRoute>
      <AuthRoute
        path="/hotelEditor"
        Component={HotelEditor}
        requiredRoles={[ADMIN, HOTEL_ADMIN]}
      ></AuthRoute>
      <AuthRoute
        path="/users"
        Component={UserTable}
        requiredRoles={[ADMIN]}
      ></AuthRoute>
      <Redirect to="/home" />
    </Switch>
  );
}
