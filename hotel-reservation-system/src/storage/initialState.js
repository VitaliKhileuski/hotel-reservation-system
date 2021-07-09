const initialState = {
  isLogged: false,
  role: "",
  name: "",
  email: "",
  userId: 0,
  checkInDate: new Date(Date.now()),
  checkOutDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
};

export default initialState;
