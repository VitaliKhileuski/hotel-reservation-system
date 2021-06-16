import { React, useEffect, useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import HotelListItem from "./HotelListItem";

export default function HotelList({ toRoomsPage, hotels }) {
  return (
    <Box p={4}>
      <Grid justify="center" alignItems="center" container spacing={0}>
        {hotels.map((hotelListItem, i) => {
          return (
            <>
              <HotelListItem
                toRoomsPage={() => toRoomsPage()}
                hotel={hotelListItem}
              />
            </>
          );
        })}
      </Grid>
    </Box>
  );
}
