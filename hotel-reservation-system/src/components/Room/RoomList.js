import { React, useEffect, useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import RoomListItem from './RoomListItem'

export default function RoomList({ rooms }) {
  return (
    <Box p={4}>
      <Grid justify="center" alignItems="center" container spacing={0}>
        {hotels.map((hotelListItem, i) => {
          return (
            <>
              <HotelListItem hotel={hotelListItem} />
            </>
          );
        })}
      </Grid>
    </Box>
  );
}
