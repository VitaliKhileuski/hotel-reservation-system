import { React, useEffect, useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import API from "./../../api";
import RoomList from "./RoomList";

const useStyles = makeStyles((theme) => ({
  pagination: {
    "& > * + *": {
      marginTop: "2",
    },
  },
}));

export default function RoomsPage(props) {
  const [rooms, setRooms] = useState([]);
  const [hotelId, setHotelId] = useState(props.location.state.hotelId);
  const [checkInDate, setCheckInDate] = useState(
    props.location.state.checkInDate
  );
  const [checkOutDate, setCheckOutDate] = useState(
    props.location.state.checkOutDate
  );
  const [page, setPage] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const pageSize = 8;
  const classes = useStyles();
  const userId = useSelector((state) => state.userId);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadRooms = async () => {
      await API.get("/rooms/" + hotelId, {
        params: {
          UserId: userId,
          CheckInDate: checkInDate.toJSON(),
          CheckOutDate: checkOutDate.toJSON(),
          PageNumber: page,
          PageSize: pageSize,
        },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setRooms(data.items);
          setNumberOfPages(data.numberOfPages);
        })
        .catch((error) => console.log(error.response.data.message));
    };
    if (!!token && !!userId) {
      loadRooms();
    }
    if (!token && !userId) {
      loadRooms();
    }
  }, [page, userId]);

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
