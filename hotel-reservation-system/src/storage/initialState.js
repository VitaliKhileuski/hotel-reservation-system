import moment from "moment";
const initialState = {
  tokenData: {
    isLogged: false,
    role: "",
    name: "",
    email: "",
    userId: "",
  },

  dates: {
    checkInDate: new Date(),
    checkOutDate: moment().add(2, "days")._d,
  },

  alertInfo: {
    openAlert: false,
    message: "",
    success: true,
    failureMessage: "",
  },
};

export default initialState;
