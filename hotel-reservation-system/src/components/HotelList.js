
import {React, useEffect, useState} from 'react'
import { Box, Grid } from '@material-ui/core'



export default function HotelList(hotels){
    const [hotels2, setHotels2] = useState(Array.from(hotels));
    useEffect(() => {
        setHotels2(Array.from(hotels));
        console.log(hotels);
      }, [hotels]);
    return(
        <Box p={5}>
        <Grid container spacing ={5}>
            {Array.from(hotels).map((HotelListItem, i) => {
                return(
                    <Grid key={i} item>
                        <HotelListItem {...HotelListItem}/>
                    </Grid>
                );
            })}
        </Grid>
        </Box>
    );
}