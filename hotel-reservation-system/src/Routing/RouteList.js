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
import { ADMIN, HOTEL_ADMIN, USER } from "./../config/Roles"; 

export default function RouterList() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
      <AuthRoute path="/ownedHotels" component={HotelTable} requiredRoles={[ADMIN,HOTEL_ADMIN]}></AuthRoute>
      {/* <Route path="/ownedHotels" component={HotelTable}></Route> */}
      <Route path="/orders" component={OrderTable}></Route>
      <Route path="/userProfile" component={UserProfile}></Route>
      <Route
        path="/hotelEditor"
        render={(props) => <HotelEditor {...props} />}
      />
      <Route path="/rooms" render={(props) => <RoomsPage {...props} />} />
      <Route path="/users" component={UserTable}></Route>
      <Redirect to="/home" />
    </Switch>
  );
}
