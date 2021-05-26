import {React, useState} from 'react'
import { Card , makeStyles, CardActionArea, CardActions,
         CardContent, 
         CardMedia,
         Typography} from '@material-ui/core';


const useStyles = makeStyles({
    root : {
        maxWidth : 345,
    },
    media : {
        height : 140,
    }
})

export default function HotelListItem(hotel){
    console.log(hotel);
const [hotel2, setHotel2] = useState(hotel);
    useEffect(() => {
        setHotel2(hotel);
        console.log(hotel);
        console.log("dasgasg")
      }, [hotel]);

    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                 image = "./../img/hotel.jpg"
                 className={classes.media}
                 title={hotel.name}>
                 </CardMedia>
                 <CardContent>
                     <Typography>
                         {hotel.name}
                     </Typography>
                     <Typography variant='body2'>
                         location info
                     </Typography>
                 </CardContent>
            </CardActionArea>
        </Card>
    )
}