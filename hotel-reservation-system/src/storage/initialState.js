import moment from "moment";
const initialState = {
  isLogged: false,
  role: "",
  name: "",
  email: "",
  userId: "",
  checkInDate: new Date(),
  checkOutDate: moment().add(2, "days")._d,
};

export default initialState;
