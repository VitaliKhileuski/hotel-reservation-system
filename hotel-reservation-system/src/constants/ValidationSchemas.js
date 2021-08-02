import * as Yup from "yup";
import { PHONE_REGEX, PASSWORD_REGEX } from "./Regex";

export const REGISTER_VALIDATION_SCHEMA = Yup.object().shape({
  firstName: Yup.string().trim().required("first name is required"),
  lastName: Yup.string().trim().required("last name is required"),
  phone: Yup.string()
    .required("phone number is required")
    .matches(PHONE_REGEX, "enter valid phone"),
  password: Yup.string()
    .min(8, "Minimum characters should be 8")
    .required("password is required")
    .matches(
      PASSWORD_REGEX,
      "password should contains numbers and latin letters"
    ),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export const HOTEL_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required("name is required").trim(),
  country: Yup.string().required("country is required").trim(),
  city: Yup.string().required("city is required").trim(),
  street: Yup.string().required("street is required").trim(),
});

export const SERVICE_VALIDATION_SCHEMA = Yup.object().shape({
  payment: Yup.number()
    .typeError("you must specify a number")
    .required("payment is required"),
});

export const ROOM_VALIDATION_SCHEMA = Yup.object().shape({
  roomNumber: Yup.string().required("room number is required").trim(),
  bedsNumber: Yup.number()
    .typeError("you must specify a number")
    .required("beds number is required"),
  paymentPerDay: Yup.number()
    .typeError("you must specify a number")
    .required("payment per day is required"),
});

export const UPDATE_USER_VALIDATION_SCHEMA = Yup.object().shape({
  firstName: Yup.string().required("first name is required"),
  lastName: Yup.string().required("last name is required"),
  phone: Yup.string()
    .required("phone number is required")
    .matches(PHONE_REGEX, "enter valid phone"),
});
