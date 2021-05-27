import {React, useState, useEffect} from 'react'
import { Card , makeStyles, CardActionArea,
         CardContent, 
         CardMedia,
         Typography} from '@material-ui/core';
import image from './../img/hotel.jpg'


const useStyles = makeStyles({
    root : {
        minWidth : 350,
        margin : 11
    },
    media : {
        height : 170,
    }
})

export default function HotelListItem({hotel}){
    console.log(hotel.location);
// const [hotel2, setHotel2] = useState(hotel);
//     useEffect(() => {
//         setHotel2(hotel);
//         console.log(hotel);
//         console.log("dasgasg")
//       }, [hotel]);

    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                 image = {image}
                 className={classes.media}
                 title={hotel.name}>
                 </CardMedia>
                 <CardContent>
                     <Typography>
                         {hotel.name}
                     </Typography>
                     <Typography variant='body2'>
                         counrty:{hotel.location.country}
                     </Typography>
                     <Typography variant='body2'>
                         city:{hotel.location.city}
                     </Typography>
                     <Typography variant='body2'>
                         street:{hotel.location.street} {hotel.location.buildingNumber}
                     </Typography>
                 </CardContent>
            </CardActionArea>
        </Card>
    )
}