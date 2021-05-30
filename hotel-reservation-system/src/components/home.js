import {React, useEffect, useState} from 'react'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { Typography , Button} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import API from '../api'
import HotelList from './HotelList';
import Pagination from '@material-ui/lab/Pagination';



const useStyles = makeStyles((theme) => ({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
    pagination: {
      '& > * + *': {
        marginTop: '2'
      },
    },
    nav: {
      '& > * + *': {
        marginTop: theme.spacing(5),
      },
         }
  }
}));

export default function Home(){
  const [city,setCity] = useState('');
  const [countries,setCountries] = useState([]);
  const [cities,setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState('');
  const [hotels,setHotels] = useState([]);
  const [checkInDate, setCheckInDate] = useState(new Date(Date.now()));
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 2*24*60*60*1000));
  const [page, setPage] = useState(1);
  const [maxPage,setMaxPage] = useState(1);

  useEffect(() => {
    const loadCountries = async () => {
      await  API
      .get('/locations/countries')
      .then(response => response.data)
      .then((data) => {
        if(data!==undefined)
        setCountries(data);
      })
      .catch((error) => console.log(error));
    };
    loadCountries();
  }, []);

    useEffect(() => {
      const loadCities = async () => {
        await  API
        .get('/locations/cities/'+currentCountry)
        .then(response => response.data)
        .then((data) => {
          if(data!==undefined)
          setCities(data);
        })
        .catch((error) => console.log(error));
  
      };
      setCities([]);
      if(currentCountry!==""){
        loadCities();
      }
      setCity("")
      
    },[currentCountry])

    const getFilteredHotels = async () => {
      await  API
      .get('/hotels?checkInDate='+checkInDate.toJSON()+'&checkOutDate='+checkOutDate.toJSON()+'&country='+currentCountry+'&city='+city+'&PageNumber='+page+'&PageSize=4')
      .then(response => response.data)
      .then((data) => {
        setHotels(data.item1);
        setMaxPage(data.item2);
      })
      .catch((error) => console.log(error));
      
    };

    useEffect(() => {
     getFilteredHotels();
    },[page])


    const classes = useStyles();
    const tommorow  = new Date(Date.now() + 24*60*60*1000);
    const handleDateCheckInChange = (date) => {
      setCheckInDate(date);
    };
    const handleDateCheckOutChange = (date) => {
      setCheckOutDate(date);
    };
    const changePage = (event, value) => {
      setPage(value);
    };

    
      
    return (
      <>
        <Grid
          className={classes.grid}
          container
          direction="row"
          justify="center"
          alignItems="flex-start" 
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
            <Typography variant='h6'>
              Check in Date
            </Typography>
            <KeyboardDatePicker
              disableToolbar
              disablePast
              variant="inline"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              value={checkInDate}
              onChange={handleDateCheckInChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          <Grid>
          <Typography variant='h6'>
              Check out date
            </Typography>
            <KeyboardDatePicker
              disableToolbar
              minDate={tommorow}
              variant="inline"
              format="MM/dd/yyyy"
              inputVariant="outlined"
              value={checkOutDate}
              onChange={handleDateCheckOutChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
            </MuiPickersUtilsProvider>
          <Grid>
            <Typography variant = 'h6'>
              What place do you want to visit?
            </Typography>
                <Autocomplete 
                id="combo-box-demo"
                options={countries}
                onChange={(event, value) => setCurrentCountry(value)}
                getOptionLabel={(option) => option}
                style={{ width: 300 }}
                renderInput={(params) => <TextField  {...params} label="choose your counrty" variant="outlined" />}
                />
          </Grid>
          <Grid>
            <Typography variant='h6'>
              Choose your city
            </Typography>
             <Autocomplete 
                id="combo-box-demo2"
                options={cities}
                getOptionLabel={(option) => option}
                onChange={(event, value) => setCity(value)}
                style={{ width: 300 }}
                value = {city}
                renderInput={(params) => <TextField  {...params} label="choose your city" variant="outlined" />}
                /></Grid>
          <Grid container
            direction="row"
            justify="center"
            alignItems="flex-start"
          > 
            <Button
             variant="contained"
              color="primary"
               size='large'
               onClick = {getFilteredHotels}
               >
             Search
            </Button>
          </Grid>
          </Grid>
          <HotelList  hotels ={hotels}></HotelList>
          <Pagination className={classes.pagination} page={page} count={maxPage} color="primary" onChange={changePage} />
          </>

    );
}