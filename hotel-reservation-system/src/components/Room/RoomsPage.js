import { React, useEffect, useState } from "react";
import RoomList from "./RoomList";
import API from "./../../api";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  pagination: {
    "& > * + *": {
      marginTop: "2",
    },
  },
}));

export default function RoomsPage(props) {
  const [rooms, setRooms] = useState([]);
  console.log(props);
  const [hotelId, setHotelId] = useState(props.location.state.hotelId);
  const [checkInDate, setCheckInDate] = useState(
    props.location.state.checkInDate
  );
  const [checkOutDate, setCheckOutDate] = useState(
    props.location.state.checkOutDate
  );
  console.log(props);
  const [page, setPage] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const pageSize = 8;
  const classes = useStyles();

  useEffect(() => {
    const loadRooms = async () => {
      await API.get(
        "/rooms/" +
          hotelId +
          "?checkInDate=" +
          checkInDate.toJSON() +
          "&checkOutDate=" +
          checkOutDate.toJSON() +
          "&PageNumber=" +
          page +
          "&PageSize=" +
          pageSize
      )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setRooms(data.items);
          setNumberOfPages(data.numberOfPages);
        })
        .catch((error) => console.log(error.response.data.message));
    };
    loadRooms();
    console.log(rooms);
  }, [page]);
  console.log("rooms page");
  console.log(checkOutDate);

  const changePage = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <RoomList
        rooms={rooms}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      ></RoomList>
      <Pagination
        className={classes.pagination}
        page={page}
        count={numberOfPages}
        color="primary"
        onChange={changePage}
      />
    </>
  );
}
