import { React } from "react";
import { Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import BaseCard from "./../shared/BaseCard";

export default function RoomList({ rooms, checkInDate, checkOutDate }) {
  return (
    <Box p={4}>
      <Grid justify="center" alignItems="center" container spacing={0}>
        {rooms.map((roomListItem, i) => {
          const content = [
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
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
            />
          );
        })}
      </Grid>
    </Box>
  );
}
