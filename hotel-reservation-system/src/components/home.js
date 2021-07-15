import { React, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { useDispatch, useSelector } from "react-redux";
import API from "../api";
import { CHECK_IN_DATE, CHECK_OUT_DATE } from "../storage/actions/actionTypes";
import HotelList from "./Hotel/HotelList";
import DateFilter from "./Filters/DateFilter";

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
    },
    nav: {
      "& > * + *": {
        marginTop: theme.spacing(5),
      },
    },
  },
}));

export default function Home() {
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState("");
  const [hotels, setHotels] = useState([]);
  const [hotelNames,setHotelNames] = useState([])
  const [hotelName,setHotelName] = useState("");
  const [isValidDates, setIsValidDates] = useState(true);
  const [checkInDate, setCheckInDate] = useState(
    useSelector((state) => state.checkInDate)
  );
  const [checkOutDate, setCheckOutDate] = useState(
    useSelector((state) => state.checkOutDate)
  );
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const pageSize = 8;
  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCountries();
    loadHotelNames();
  }, []);

  const loadCountries = async () => {
    await API.get("/locations/countries")
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setCountries(data);
      })
      .catch((error) => console.log(error));
  };

  const loadHotelNames = async () => {
    await API.get("/hotels/hotelNames")
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setHotelNames(data);
      })
      .catch((error) => console.log(error));
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
      loadCities();
    }
    setCity("");
  }, [currentCountry]);

  async function SearchFilteredHotels() {
    dispatch({ type: CHECK_IN_DATE, checkInDate: checkInDate });
    dispatch({ type: CHECK_OUT_DATE, checkOutDate: checkOutDate });

    const getFilteredHotels = async () => {
      await API.get(
        "/hotels/page?" +
          "userId=" +
          userId +
          "&checkInDate=" +
          checkInDate.toJSON() +
          "&checkOutDate=" +
          checkOutDate.toJSON() +
          "&country=" +
          currentCountry +
          "&city=" +
          city +
          "&hotelName=" +
          hotelName +
          "&PageNumber=" +
          page +
          "&PageSize=" +
          pageSize
      )
        .then((response) => response.data)
        .then((data) => {
          setHotels(data.items);
          setMaxPage(data.numberOfPages);
        })
        .catch((error) => console.log(error));
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
    SearchFilteredHotels();
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
            id="combo-box-demo"
            options={countries}
            onChange={(event, value) => {
              console.log(value);
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
            id="combo-box-demo2"
            options={cities}
            getOptionLabel={(option) => option}
            onChange={(event, value) => setCity(value)}
            disabled={currentCountry === null ? true : false}
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
          <Autocomplete
            id="combo-box-demo2"
            options={hotelNames}
            getOptionLabel={(option) => option}
            onChange={(event, value) => setHotelName(value)}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="find by name"
                variant="outlined"
              />
            )}
          />
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
            disabled={!isValidDates}
            onClick={SearchFilteredHotels}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <HotelList
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
      />
    </>
  );
}