import React,{useEffect, useState} from 'react'
import {MapContainer, TileLayer,Marker,Popup} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Markers from './Markers'
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  table: {
    width: "100%",
  },
  none: {
    display: 'none'
  }
}));

function MapaView() {
  const classes = useStyles();
  const [places, setPlaces] = useState([])
  const [openBd, setOpenBd] = useState(true);

    useEffect(() => {
      const fetchData = async() =>{
          const res = await axios.post('https://emergencia24horas.segurospiramide.com/node/express/servicios/api/BuscaTodasSolicitudes', {
              "cStsSoli": 0,
              "dFecDesde": "",
              "dFecHasta": "",
              "cCodUsr":"0"
          })
          // console.log(res.data)
          setPlaces(res.data)
          setOpenBd(false)
      }
      fetchData();
   }, [])
        
    return(
      <>
      <Backdrop className={classes.backdrop} open={openBd} >
       <CircularProgress color="inherit" />
     </Backdrop>
      <MapContainer center={{lat:"10.4904098",lng:"-66.8647979" }} zoom={13} style={{height:"80vh", width:"96vw", margin:0}} >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      
        <Markers places={places}/> 
      </MapContainer>
      </>
    )
}

export default MapaView
