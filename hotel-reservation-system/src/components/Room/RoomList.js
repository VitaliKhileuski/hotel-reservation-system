import { React, useEffect, useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import BaseCard from "./../shared/BaseCard";

export default function RoomList({ rooms }) {
  return (
    <Box p={4}>
      <Grid justify="center" alignItems="center" container spacing={0}>
        {rooms.map((roomListItem, i) => {
          let content = [
            `room number: ${roomListItem.roomNumber}`,
            `beds number: ${roomListItem.bedsNumber}`,
            `payment per day: ${roomListItem.paymentPerDay}`,
          ];
          return (
            <BaseCard
              key={i}
              imageUrls={roomListItem.imageUrls}
              contentRows={content}
              room={roomListItem}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
