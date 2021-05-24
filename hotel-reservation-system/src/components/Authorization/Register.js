import {React, useState} from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Formik, Form, ErrorMessage, Field} from 'formik'
import * as Yup from 'yup'
import api from './../../api/'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const [customError, setCustomError] = useState('');
  const [flag, setFlag] = useState(true);
  const phoneRegExp = /^\+((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const initialValues = {
    lastName:'',
    firstName:'',
    email :'',
    password :'',
    birthDate: Date.UTC,
    phone: ''
  }
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("firstName is required"),
    lastName: Yup.string().required("lastName is required"),
    phone : Yup.string().required("phone number is required").matches(phoneRegExp,"enter valid phone"),
    email: Yup.string().email("Enter valid email").required("email is required").test('userExists','batwa',function(){return true}),
    password: Yup.string().min(5, "Minimum characters should be 5").required('password is required').matches(/^(?=.*[0-9])(?=.*[a-z])/,"password should contains numbers and letters")
})
  const onSubmit = (values,props) => {
    setFlag(true);
    const request = {
      Email: values.email,
      Name: values.firstName,
      SurName: values.lastName,
      UserName: values.userName,
      PhoneNumber: values.phone,
      Password: values.password,
      BirthDate: values.birthDate,
    };
      api
      .post('/account/register', request)
			.then((response) => {
			console.log(response);
			})
			.catch((error) => {
          setCustomError(error.response.data.Message)
          setFlag(true);
          console.log(error.response.data.Message)
          console.log(error.response.data);
      })
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik initialValues ={ initialValues } async onSubmit={onSubmit} validationSchema={validationSchema}>
        {(props) =>(
        <Form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Field as = {TextField}
                variant="outlined"
                autoComplete="lname"
                name="firstName"
                required
                error={props.errors.firstName && props.touched.firstName}
                helperText={<ErrorMessage name='firstName' />}
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                error={props.errors.lastName && props.touched.lastName}
                helperText={<ErrorMessage name='lastName' />}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                error={props.touched.email}
                helperText={<ErrorMessage name='email' />}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <Field as = {TextField}
              fullWidth
              required
              label='Phone Number'
              variant='outlined'
              name='phone'
              error={props.errors.phone && props.touched.phone}
              helperText={<ErrorMessage name='phone' />}
              />
            </Grid>
            <Grid item xs={12}>
              <Field as = {TextField}
              fullWidth
              type ='Date'
              variant='outlined'
              name='birthdate'
              error={props.errors.birthDate && props.touched.birthDate}
              helperText={<ErrorMessage name='birthDate' />}
              />
            </Grid>
            <Grid item xs={12}>
              <Field as = {TextField}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                error={props.errors.password && props.touched.password}
                helperText={<ErrorMessage name='password' />}
                type="password"
                id="password"
                autoComplete="current-password"
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Form>
        )}
        </Formik>
      </div>
      <Box mt={5}>
      </Box>
    </Container>
  );
}