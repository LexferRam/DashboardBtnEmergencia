import React,{useEffect, useState} from "react";
import { Marker, Popup } from "react-leaflet";
// import { VenueLocationIcon } from "./VenueLocationIcon";
import L from "leaflet";
import Icon from "./marker.svg";
import IconAte from "./markerAte.svg";
import Logopira from "../logopira.svg";
import Logoocea from "../logoocea.png";

const markrIcon = new L.Icon({
  iconUrl: Icon,
  iconSize: [55, 55],
  shadowAnchor: [17, 46],
  popupAnchor: [-8, -20],
});
const markrIconAte = new L.Icon({
  iconUrl: IconAte,
  iconSize: [55, 55],
  shadowAnchor: [17, 46],
  popupAnchor: [-8, -20],
});

function Markers({places}){
  const [markers, setMarkers] = useState([])
  useEffect(() => {
    console.log('aqui desde markers '+ JSON.stringify(places))
    setMarkers(places)
   }, [places])
   
  return(
    // place.LATITUD !== '0' &&
    // markers.map((place, i) => (
      places.LATITUD !== null && places.STSSOLI === 'PEN' || places.STSSOLI === 'BLO'  || places.STSSOLI === ' '  ? (
        <Marker
          key={places.id}
          position={[places.LATITUD, places.LONGITUD]}
          icon={markrIcon}
        >
          <Popup>
                  {places.EMPRESA == "PIRAMIDE" ? (
                      <img src={Logopira} style={{ heigth: 50, width: 170, display: "block" }} />
                  ) : (
                      <img src={Logoocea} style={{ heigth: 50, width: 170, display: "block" }} />
                  )}
            
            <b>Nro de solicitud: </b>{places.id}<br />
            <b>Estatus de solicitud: </b>{places.STSSOLI == "PEN" ? (
                "PENDIENTE"
              ) : places.STSSOLI == "ATE" ? (
                "ATENDIDO"
              ) : (

                "")}<br />
            <b>Nombre:</b>{places.NOMBRE}
          </Popup>
        </Marker>

      ) : places.LATITUD !== null && places.STSSOLI === 'ATE' ? (
        <Marker
          key={places.id}
          position={[places.LATITUD, places.LONGITUD]}
          icon={markrIconAte}
        >
          <Popup>
                      {places.EMPRESA == "PIRAMIDE" ? (
                          <img src={Logopira} style={{ heigth: 50, width: 170, display: "block" }} />
                      ) : (
                          <img src={Logoocea} style={{ heigth: 50, width: 170, display: "block" }} />
                      )}
            <b>Nro de solicitud: </b>{places.IDSOLICITUD}<br />
            <b>Estatus de solicitud: </b>{places.STSSOLI == "PEN" ? (
                "PENDIENTE"
              ) : places.STSSOLI == "ATE" ? (
                "ATENDIDO"
              ) : (
                "")}<br />
            <b>Nombre:</b>{places.NOMBRE}
          </Popup>
        </Marker>
      ) : (null)
    
    
    // )
    // )
  )
};

export default Markers;