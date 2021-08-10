import axios from "axios";
import { baseURL } from "../constants/Urls";

export default axios.create({
  baseURL: baseURL,
  responseType: "json",
});
