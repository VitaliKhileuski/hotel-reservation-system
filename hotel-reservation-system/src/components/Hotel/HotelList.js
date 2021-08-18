import { React } from "react";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { ROOMS_PATH } from "../../constants/RoutingPaths";
import Skeleton from "@material-ui/lab/Skeleton";
import BaseCard from "./../shared/BaseCard";

export default function HotelList({
  toRoomsPage,
  hotels,
  checkInDate,
  checkOutDate,
}) {
  const history = useHistory();
  function toRoomsPage(hotel) {
    const hotelId = hotel.id;
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
        {hotels.length !== 0
          ? hotels.map((hotelListItem, i) => {
              let content = [
                `${hotelListItem.name}`,
                `country: ${hotelListItem.location.country}`,
                `city: ${hotelListItem.location.city}`,
                `street: ${hotelListItem.location.street} ${hotelListItem.location.buildingNumber}`,
              ];
              return (
                <>
                  <BaseCard
                    hotel={hotelListItem}
                    imageUrls={hotelListItem.imageUrls}
                    contentRows={content}
                    clickAction={() => toRoomsPage(hotelListItem)}
                  />
                </>
              );
            })
          : Array.from(new Array(8)).map((item, index) => {
              return (
                <Grid item>
                  <Skeleton
                    style={{ margin: 11 }}
                    variant="rect"
                    width={350}
                    height={270}
                  />
                </Grid>
              );
            })}
      </Grid>
    </Box>
  );
}
