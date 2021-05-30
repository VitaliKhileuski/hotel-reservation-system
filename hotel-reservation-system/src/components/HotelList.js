
import {React} from 'react'
import { Box, Grid } from '@material-ui/core'
import HotelListItem from './HotelListItem'



export default function HotelList({hotels}){
    return(
        <Box p={4}>
        <Grid justify="center" alignItems="center" container spacing ={0} margin='normal'>
            {hotels.map((hotelListItem) => {
                return(
                        <HotelListItem id={hotelListItem.id} key={hotelListItem.id} hotel ={hotelListItem}/>
                );
            })}
        </Grid>
        </Box>
    );
}