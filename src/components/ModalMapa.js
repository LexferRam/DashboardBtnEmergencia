import React, {useState, useContext, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { ClickAwayListener, MenuItem, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import AuthContext from "../Context/AuthContext/AuthContext";
import Markers from './MarkersInd'

import {MapContainer, TileLayer,Marker,Popup} from "react-leaflet"
import "leaflet/dist/leaflet.css"

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({openMap, setOpenMap,rowsSelecc}) {
  const [fila, setFila] = useState(false);
  const [places, setPlaces] = useState([])

  useEffect(() => {
    setFila(rowsSelecc)
    console.log(rowsSelecc)
    setPlaces(rowsSelecc)
  }, [])

  return (
      <div>
          <Dialog aria-labelledby="customized-dialog-title" onClose={() => setOpenMap(false)} open={openMap}>
              <DialogTitle id="customized-dialog-title" onClose={() => setOpenMap(false)}>
                  Solicitud Nro: {rowsSelecc.id}
              </DialogTitle>
              <DialogContent >
                  <MapContainer center={{ lat: rowsSelecc.LATITUD, lng: rowsSelecc.LONGITUD }} zoom={16} style={{ height: "80vh", width: 550, margin: 0 }} >
                      <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                     <Markers places={rowsSelecc}/> 
                  </MapContainer>
              </DialogContent>
          </Dialog>
    </div>
  );
}