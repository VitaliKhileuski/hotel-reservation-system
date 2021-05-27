
import {React, useEffect, useState} from 'react'
import { Box, Grid } from '@material-ui/core'
import HotelListItem from './HotelListItem'



export default function HotelList({hotels}){
    // const [hotels2, setHotels2] = useState(Array.from(hotels));
    // useEffect(() => {
    //     setHotels2(Array.from(hotels));
    //     console.log(hotels);
    //   }, [hotels]);
    //   const hotelList = Array.from(hotels).map(hotel => <hotelListItem hotel={hotel})
    return(
        <Box p={4}>
        <Grid justify="center" alignItems="center" container spacing ={0} margin='normal'>
            {hotels.map((hotelListItem, i) => {
                return(
                    <>
                        <HotelListItem hotel ={hotelListItem}/>
                    </>
                );
            })}
        </Grid>
        </Box>
    );
}