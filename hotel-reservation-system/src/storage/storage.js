import { createStore } from "redux";
import reducers from "./reducers/authentication";

const storage = createStore(reducers);

export default storage;
