import {React, useEffect, useState} from 'react'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { Typography , Button} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'



const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  comboBox: {
    MarginTop : 15
  }
});

export default function Home(){
  const [countries,setCountries] = useState([]);
  useEffect(() => {
    const loadCountries = async () => {
      await  axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => response.data)
      .then((data) => setCountries(data))
      .catch((error) => console.log(error));
    };
    loadCountries();
  }, []);

  const classes = useStyles();
    const [checkInDate, setCheckInDate] = useState(Date.now);
    const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 24*60*60*1000));
    const tommorow  = new Date(Date.now() + 24*60*60*1000);
    const handleDateCheckInChange = (date) => {
      setCheckInDate(date);
    };
    const handleDateCheckOutChange = (date) => {
      setCheckOutDate(date);
    };
    return (
        <Grid
          className={classes.grid}
          container
          direction="row"
          justify="center"
          alignItems="flex-start" 
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
            <Typography variant='h6' margin='normal'>
              Check in Date
            </Typography>
            <KeyboardDatePicker
              disableToolbar
              disablePast
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              value={checkInDate}
              onChange={handleDateCheckInChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid>
          <Typography variant='h6' margin='normal'>
              Check out date
            </Typography>
            <KeyboardDatePicker
              disableToolbar
              minDate={tommorow}
              variant="inline"
              margin="normal"
              format="MM/dd/yyyy"
              value={checkOutDate}
              onChange={handleDateCheckOutChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
            </MuiPickersUtilsProvider>
          <Grid>
            <Typography variant = 'h6' margin='nornal'>
              What place do you want to visit?
            </Typography>
                <Autocomplete 
                id="combo-box-demo"
                options={countries}
                margin="normal"
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => <TextField  {...params} label="choose your counrty" variant="outlined" />}
                />
          </Grid>
          <Grid>
            <Button variant="contained" color="primary" size='large'>
             Search
            </Button>
          </Grid>
          </Grid>
    );
}