import { React } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./../components/Authorization/Login";
import Register from "./../components/Authorization/Register";
import HotelsPage from "./../components/Hotel/HotelsPage";
import HotelTable from "./../components/Hotel/HotelTable";
import HotelEditor from "./../components/Hotel/HotelEditor";
import RoomsPage from "./../components/Room/RoomsPage";
import OrderTable from "./../components/Reservation/OrderTable";
import UserProfile from "./../components/User/UserProfile";
import UserTable from "../components/User/UserTable";
import AuthRoute from "./../Routing/AuthRoute";
import RoomPage from "./../components/Room/RoomPage";
import NotAuthorizeErrorPage from "../components/Errors/NotAuthorizeErrorPage";
import ForbiddenPage from "../components/Errors/ForbiddenPage";
import NotFoundErrorPage from "../components/Errors/NotFoundErrorPage";
import { ADMIN, HOTEL_ADMIN } from "../constants/Roles";
import {
  HOME_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  ROOMS_PATH,
  ROOM_DETAILS_PATH,
  OWNED_HOTELS_PATH,
  ORDERS_PATH,
  USER_PROFILE_PATH,
  HOTEL_EDITOR_PATH,
  USERS_PATH,
  NOT_FOUND_ERROR_PATH,
  NOT_AUTHORIZED_ERROR_PATH,
  FORBIDDEN_ERROR_PATH,
} from "./../constants/RoutingPaths";

export default function RouterList() {
  return (
    <Switch>
      <Route path={NOT_FOUND_ERROR_PATH} component={NotFoundErrorPage}></Route>
      <Route
        path={NOT_AUTHORIZED_ERROR_PATH}
        component={NotAuthorizeErrorPage}
      ></Route>
      <Route path={FORBIDDEN_ERROR_PATH} component={ForbiddenPage}></Route>
      <Route path={HOME_PATH} component={HotelsPage} />
      <Route path={LOGIN_PATH} component={Login} />
      <Route path={REGISTER_PATH} component={Register} />
      <Route path={ROOMS_PATH} render={(props) => <RoomsPage {...props} />} />
      <Route
        path={ROOM_DETAILS_PATH}
        render={(props) => <RoomPage {...props} />}
      />
      <AuthRoute
        path={OWNED_HOTELS_PATH}
        Component={HotelTable}
        requiredRoles={[ADMIN, HOTEL_ADMIN]}
      ></AuthRoute>
      <AuthRoute path={ORDERS_PATH} Component={OrderTable}></AuthRoute>
      <AuthRoute path={USER_PROFILE_PATH} Component={UserProfile}></AuthRoute>
      <AuthRoute
        path={HOTEL_EDITOR_PATH}
        Component={HotelEditor}
        requiredRoles={[ADMIN, HOTEL_ADMIN]}
      ></AuthRoute>
      <AuthRoute
        path={USERS_PATH}
        Component={UserTable}
        requiredRoles={[ADMIN]}
      ></AuthRoute>
      <Redirect to={NOT_FOUND_ERROR_PATH} />
    </Switch>
  );
}
