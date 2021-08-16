import { React, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { useDispatch, useSelector } from "react-redux";
import API from "./../../api";
import { DATES } from "./../../storage/actions/actionTypes";
import HotelList from "./HotelList";
import DateFilter from "./../Filters/DateFilter";
import AsyncAutocomplete from "./../shared/AsyncAutocomplete";
const useStyles = makeStyles((theme) => ({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
    pagination: {
      "& > * + *": {
        marginTop: "2",
      },
      grid : {
        marginTop: 15
      }
    },
    nav: {
      "& > * + *": {
        marginTop: theme.spacing(5),
      },
    },
  },
}));

export default function () {
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [hotelNames, setHotelNames] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [isValidDates, setIsValidDates] = useState(true);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(
    useSelector((state) => state.dates.checkInDate)
  );
  const [checkOutDate, setCheckOutDate] = useState(
    useSelector((state) => state.dates.checkOutDate)
  );
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const pageSize = 8;
  const userId = useSelector((state) => state.tokenData.userId);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [filterFlag, setFilterFlag] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    await API.get("/locations/countries")
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setCountries(data);
      })
      .catch((error) => console.log(error));
  };

  const loadHotelNames = async (value, setNewItems, setCurrentLoading) => {
    setHotelName(value);
    if (!!value) {
      setCurrentLoading(true);
      await API.get("/hotels/hotelNames", {
        params: {
          hotelName: value,
        },
      })
        .then((response) => response.data)
        .then((data) => {
          if (!!data) {
            setCurrentLoading(false);
            setNewItems(data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      setNewItems([]);
    }
  };

  useEffect(() => {
    const loadCities = async () => {
      await API.get("/locations/cities/" + currentCountry)
        .then((response) => response.data)
        .then((data) => {
          if (!!data) setCities(data);
        })
        .catch((error) => console.log(error));
    };
    setCities([]);
    if (currentCountry !== "") {
      setLoading(true);
      loadCities();
    }
    setCity("");
  }, [currentCountry]);

  async function handleSearchButton() {
    setFilterFlag(false);
    setPage(1);
    await SearchFilteredHotels(1);
  }

  async function SearchFilteredHotels(pageNumber) {
    dispatch({
      type: DATES,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    });
    let requestPageNumber = !!pageNumber ? pageNumber : page;
    const getFilteredHotels = async () => {
      await API.get("/hotels/page", {
        params: {
          UserId: userId,
          CheckInDate: checkInDate.toJSON(),
          CheckOutDate: checkOutDate.toJSON(),
          Country: currentCountry,
          City: city,
          HotelName: hotelName,
          PageNumber: requestPageNumber,
          PageSize: pageSize,
        },
      })
        .then((response) => response.data)
        .then((data) => {
          setHotels(data.items);
          setLoading(false);
          setMaxPage(data.numberOfPages);
        })
        .catch((error) => console.log(error));
      setFilterFlag(true);
    };
    if (!!token && !!userId) {
      getFilteredHotels();
    }
    if (!token && !userId) {
      getFilteredHotels();
    }
  }
  function changeDates(checkInDate, checkOutDate) {
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);
  }
  function isValidInfo(isValid) {
    setIsValidDates(isValid);
  }

  useEffect(() => {
    if (filterFlag) {
      SearchFilteredHotels();
    }
  }, [page, userId]);

  const classes = useStyles();
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
        <DateFilter
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          changeDates={changeDates}
          isValidInfo={isValidInfo}
        ></DateFilter>
        <Grid>
          <Typography variant="h6">What place do you want to visit?</Typography>
          <Autocomplete
            id="countries"
            options={countries}
            onChange={(event, value) => {
              setCurrentCountry(value);
            }}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="choose your counrty"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid>
          <Typography variant="h6">Choose your city</Typography>
          <Autocomplete
            id="cities"
            options={cities}
            getOptionLabel={(option) => option}
            onChange={(event, value) => setCity(value)}
            disabled={!!!currentCountry}
            style={{ width: 300 }}
            value={city}
            renderInput={(params) => (
              <TextField
                {...params}
                label="choose your city"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid>
          <Typography variant="h6">Find by name</Typography>
          <AsyncAutocomplete
            request={loadHotelNames}
            label="find by hotel name"
          ></AsyncAutocomplete>
        </Grid>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            style ={{ margin : 10}}
            disabled={!isValidDates}
            onClick={handleSearchButton}
          >
            Search
          </Button>
        </Grid>
      </Grid>

    {!loading && hotels.length===0 ? <Typography variant="h5" style={{marginTop : 20}}>No hotels</Typography> : <> <HotelList
        hotels={hotels}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      ></HotelList>
      <Pagination
        className={classes.pagination}
        page={page}
        count={maxPage}
        color="primary"
        onChange={changePage}
      /></>}
      
    </>
  );
}
