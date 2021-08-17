import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { createTrigger } from './../../helpers/UpdateTableWithCallingAlert'
import API from "./../../api/";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ReviewCategoryForm({ handleClose }) {
  const classes = useStyles();
  const [currentCategory, setCurrentCategory] = useState("");
  const [categoryErrorLabel, setCategoryErrorLabel] = useState("");
 

  const token = localStorage.getItem("token");

  const createCategory = async () => {
      const request = {
          Name : currentCategory.trim()
      }
    await API.post("/review/addCategory",request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        createTrigger();
        handleClose();
      })
      .catch((error) => setCategoryErrorLabel(error.response.data.Message));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
            <div className={classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="currentCategory"
                    label="category"
                    value={currentCategory}
                    onChange={(e) => setCurrentCategory(e.target.value)}
                    error={!!categoryErrorLabel}
                    helperText={categoryErrorLabel}
                    id="currentCategory"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                onClick={createCategory}
                disabled={!!!currentCategory}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Category
              </Button>
            </div>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
