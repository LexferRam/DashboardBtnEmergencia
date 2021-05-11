import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Divider, TextField } from '@material-ui/core';

export default function ModalObs({setOpenObs,openObs,msnAlert}) {
//   const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpenObs(true);
  };

  const handleClose = () => {
    setOpenObs(false);
  };

  return (
    <div >
      <Dialog
        open={openObs}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        
      >
        <DialogTitle style={{ backgroundColor: "#3f51b5", color: "white" }} id="titleModalObs">OBSERVACION</DialogTitle>
        <DialogContent 
        >
          <DialogContentText
          style={{ width: "400px !important", margin: "30px 60px", fontSize: "10px !important" }}
            id="alert-dialog-description">
                <TextField
                multiline

                // label="Observacion"
                type="text"
                // autoComplete="current-password"
                value={msnAlert}
                // onChange={hendleChangeObs}
                style={{ width: "450px" }}
                disable="true"
              />
            
        
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} id="btnModalObs" color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}