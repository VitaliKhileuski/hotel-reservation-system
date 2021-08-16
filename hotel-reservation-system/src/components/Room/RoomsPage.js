import { React, useEffect, useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const pageSize = 8;
  const classes = useStyles();
  const userId = useSelector((state) => state.tokenData.userId);
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
          setLoading(false);
          setNumberOfPages(data.numberOfPages);
        })
        .catch((error) => console.log(error.response.data.message));
    };
    if (!!token && !!userId) {
      setLoading(true);
      loadRooms();
    }
    if (!token && !userId) {
      setLoading(true);
      loadRooms();
    }
  }, [page, userId]);

  const changePage = (event, value) => {
    setPage(value);
  };

  return (
    <>
      {!loading && rooms.length === 0 ? (
        <Typography variant="h5" style={{ marginTop: 20 }}>
          No rooms
        </Typography>
      ) : (
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
      )}
    </>
  );
}
