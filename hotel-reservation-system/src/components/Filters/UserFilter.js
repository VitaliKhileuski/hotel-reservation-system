import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import API from "./../../api";

export default function UsersFilter() {
  const [emails, setEmails] = useState([]);
  const [surnames, setSurnames] = useState([]);
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const token = localStorage.getItem("token");

  useEffect =
    (() => {
      loadEmails();
      loadSurnames();
    },
    []);

  const loadEmails = async () => {
    await API.get("/users/emails", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setEmails(data);
      })
      .catch((error) => {});
  };
  const loadSurnames = async () => {
    await API.get("/users/surnames", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setSurnames(data);
      })
      .catch((error) => {});
  };

  return (
    <Grid container>
      <Grid item>
        <Autocomplete
          id="emails"
          options={emails}
          onChange={(event, value) => {
            setEmail(value);
          }}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="find by email" variant="outlined" />
          )}
        ></Autocomplete>
      </Grid>
    </Grid>
  );
}
