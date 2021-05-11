import React,{useEffect, useState} from "react";
import { Marker, Popup } from "react-leaflet";
// import { VenueLocationIcon } from "./VenueLocationIcon";
import L from "leaflet";
import Icon from "./marker.svg";
import IconAte from "./markerAte.svg";
import IconPirami from "./markerPirami.svg";
import IconOceani from "./markerOceani.svg";
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
const markrIconPirami = new L.Icon({
  iconUrl: IconPirami,
  iconSize: [55, 55],
  shadowAnchor: [17, 46],
  popupAnchor: [-8, -20],
});
const markrIconOceani = new L.Icon({
  iconUrl: IconOceani,
  iconSize: [55, 55],
  shadowAnchor: [17, 46],
  popupAnchor: [-8, -20],
});

function Markers({places}){
  const [markers, setMarkers] = useState([])
  useEffect(() => {
    // console.log('aqui desde markers '+ JSON.stringify(places))
    setMarkers(places)
   }, [places])
   
  return(
    // place.LATITUD !== '0' &&
    markers.map((place, i) => (
      place.LATITUD !== null && place.STSSOLI == "PEN" ? (
        place.EMPRESA == "PIRAMIDE" ? 
        (
          <Marker
          key={place.id}
          position={[place.LATITUD, place.LONGITUD]}
          icon={markrIconPirami}
        > <Popup>
          <img src={Logopira} style={{heigth:50, width:170, display: "block"}} />
      
        <b>Nro de solicitud: </b>{place.IDSOLICITUD}<br />
        <b>Estatus de solicitud: </b>{place.STSSOLI == "PEN" ? (
          "PENDIENTE"
        ) : place.STSSOLI == "ATE" ? (
          "ATENDIDO"
        ) : (

          "")}<br />
        <b>Nombre:</b>{place.NOMBRE}
      </Popup>
    </Marker>
        ):(
            <Marker
              key={place.id}
              position={[place.LATITUD, place.LONGITUD]}
              icon={markrIconOceani}
            > <Popup>
                <img src={Logoocea} style={{ heigth: 50, width: 170, display: "block" }} />

                <b>Nro de solicitud: </b>{place.IDSOLICITUD}<br />
                <b>Estatus de solicitud: </b>{place.STSSOLI == "PEN" ? (
                  "PENDIENTE"
                ) : place.STSSOLI == "ATE" ? (
                  "ATENDIDO"
                ) : (

                  "")}<br />
        <b>Nombre:</b>{place.NOMBRE}
      </Popup>
    </Marker>
        )
       
         

      ) : place.LATITUD !== null && place.STSSOLI === 'ATE' ? (
        <Marker
          key={place.id}
          position={[place.LATITUD, place.LONGITUD]}
          icon={markrIconAte}
        >
          <Popup>
              {place.EMPRESA == "PIRAMIDE" ? (
                <img src={Logopira} style={{heigth:50, width:170, display: "block"}} />
              ) : (
                <img src={Logoocea} style={{heigth:50, width:170, display: "block"}} />
              )}
            <b>Nro de solicitud: </b>{place.IDSOLICITUD}<br />
              <b>Estatus de solicitud: </b>{place.STSSOLI == "PEN" ? (
                "PENDIENTE"
              ) : place.STSSOLI == "ATE" ? (
                "ATENDIDO"
              ) : (

                "")}<br />
            <b>Nombre:</b>{place.NOMBRE}
          </Popup>
        </Marker>
      ) :  (null)
    
    
    ))
  )
};

export default Markers;