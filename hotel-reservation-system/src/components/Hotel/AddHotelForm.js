import {React, useState, useEffect} from 'react'
import {Button, Snackbar} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link , Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Formik, Form, ErrorMessage, Field} from 'formik'
import * as Yup from 'yup'
import API from './../../api/'
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
} 

const useStyles = makeStyles((theme) => ({
  root : {
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddHotelForm({hotel,handleClose,callAlert}) {

  const classes = useStyles();
  const [users,setUsers] = useState([]);
  const [admin,setAdmin] = useState(hotel===undefined ? '' : hotel.admin);
  const [showAlert,setShowAlert] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const loadUsers = async () => {
      await  API
      .get('/users', {
        headers: { Authorization: "Bearer " + token}
      })
      .then(response => response.data)
      .then((data) => {
          console.log(data);
        if(data!==undefined)
        setUsers(data);
      })
      .catch((error) => console.log(error));

    };
    loadUsers();
  },[])

  const initialValues = {
    name: hotel===undefined ? '' : hotel.name,
    country:hotel===undefined ? '' : hotel.location.country,
    city :hotel===undefined ? '' : hotel.location.city,
    street :hotel===undefined ? '' : hotel.location.street,
    buildingNumber: hotel===undefined ? '' : hotel.location.buildingNumber,
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    country: Yup.string().required("country is required"),
    street : Yup.string().required("street is required"),
    buildingNumber: Yup.string().required('building number is required')
  })
  const onSubmit = async (values)  => {
    const request = {
      Name: values.name,
      Location : {
          Country : values.country,
          City : values.city,
          Street : values.street,
          buildingNumber : values.buildingNumber

      } 
    };
    const CreateHotel = async () => {
        await  API
        .post('/hotels/'+ admin.id,request,{
            headers: { Authorization: "Bearer " + token}
          })
        .then(response => response.data)
        .then((data) => {
        })
        .catch((error) => console.log(error.response.data.message));
      };
    await CreateHotel();
    handleClose();
    callAlert();
    setShowAlert(true);
}
  return (
    <>
    <Container component="main" maxWidth="xs" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <Formik initialValues ={ initialValues } onSubmit={onSubmit} validationSchema={validationSchema}>
        {(props) =>(
        <Form className={classes.form}>
          <Grid container spacing={2}>
        <Grid item xs ={12}>
        <Autocomplete 
                id="hotelAdmin"
                options={users}
                value={hotel===undefined ? users[0] : admin} 
                onChange={(event, value) => setAdmin(value)}
                getOptionLabel={(option) => `${option.name} ${option.surname}(${option.email})`}
                renderInput={(params) => <TextField  {...params} label="choose hotel admin" variant="outlined" />}
                />
        </Grid>
          <Grid item xs={12}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                name="name"
                label="Name"
                error={props.errors.name && props.touched.name}
                helperText={<ErrorMessage name='name' />}
                id="name"
              />
            </Grid>
            <Grid item xs={12}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                name="country"
                label="Country"
                error={props.errors.country && props.touched.country}
                helperText={<ErrorMessage name='country' />}
                id="counrty"
              />
            </Grid>
            <Grid item xs={12}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                name="city"
                label="City"
                error={props.errors.country && props.touched.country}
                helperText={<ErrorMessage name='city' />}
                id="city"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field as = {TextField}
                variant="outlined"
                name="street"
                required
                error={props.errors.street && props.touched.street}
                helperText={<ErrorMessage name='street' />}
                fullWidth
                id="street"
                label="Street"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                id="buildingNumber"
                label="Building Number"
                name="buildingNumber"
                error={props.errors.buildingNumber && props.touched.buildingNumber}
                helperText={<ErrorMessage name='buildingNumber' />}
                autoComplete="buildingNumber"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Save
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
            </Grid>
          </Grid>
        </Form>
        )}
        </Formik>
      </div>
      <Box mt={5}>
      </Box>
    </Container>
    <Snackbar open={showAlert} autoHideDuration={3000} >
    <Alert  severity="success">
    Hotel Added successfully!
    </Alert>
  </Snackbar>
  </>
  );
}