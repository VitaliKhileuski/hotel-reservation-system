import { React, useEffect, useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import BaseCard from "./../shared/BaseCard";
import { useHistory } from "react-router";

export default function HotelList({
  toRoomsPage,
  hotels,
  checkInDate,
  checkOutDate,
}) {
  const history = useHistory();
  console.log("hotel list");
  console.log(checkOutDate);

  function toRoomsPage(hotelId) {
    history.push({
      pathname: "/rooms",
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
                clickAction={() => toRoomsPage(hotelListItem.id)}
              />
            </>
          );
        })}
      </Grid>
    </Box>
  );
}
