import { React } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { ROOMS_PATH } from "../../constants/RoutingPaths";
import BaseCard from "./../shared/BaseCard";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
} from "../../storage/actions/actionTypes";

export default function HotelList({
  toRoomsPage,
  hotels,
  checkInDate,
  checkOutDate,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  function toRoomsPage(hotel) {
    const hotelId = hotel.id;
    dispatch({ type: CHECK_IN_TIME, checkInTime: hotel.checkInTime });
    dispatch({ type: CHECK_OUT_TIME, checkOutTime: hotel.checkOutTime });
    history.push({
      pathname: ROOMS_PATH,
      state: {
        hotelId,
        checkInDate,
        checkOutDate,
      },
    });
  }
  return (
    <Box p={4}>
      <Grid justify="center" alignItems="center" container spacing={0}>
        {hotels.map((hotelListItem, i) => {
          let content = [
            `${hotelListItem.name}`,
            `country: ${hotelListItem.location.country}`,
            `city: ${hotelListItem.location.city}`,
            `street: ${hotelListItem.location.street} ${hotelListItem.location.buildingNumber}`,
          ];
          return (
            <>
              <BaseCard
                imageUrls={hotelListItem.imageUrls}
                contentRows={content}
                clickAction={() => toRoomsPage(hotelListItem)}
              />
            </>
          );
        })}
      </Grid>
    </Box>
  );
}
