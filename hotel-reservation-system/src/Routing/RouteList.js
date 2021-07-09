import { React, useEffect } from "react";
import Login from "./../components/Authorization/Login";
import Register from "./../components/Authorization/Register";
import Home from "./../components/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import HotelTable from "./../components/Hotel/HotelTable";
import HotelEditor from "./../components/Hotel/HotelEditor";
import RoomsPage from "./../components/Room/RoomsPage";
import OrderTable from "./../components/Reservation/OrderTable";
import UserProfile from "./../components/User/UserProfile";

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/home" component={Home} />
      <Route path="/ownedHotels" component={HotelTable}></Route>
      <Route path="/orders" component={OrderTable}></Route>
      <Route path="/userProfile" component={UserProfile}></Route>
      <Route
        path="/hotelEditor"
        render={(props) => <HotelEditor {...props} />}
      />
      <Route path="/rooms" render={(props) => <RoomsPage {...props} />} />
      <Redirect to="/home" />
    </Switch>
  );
}
