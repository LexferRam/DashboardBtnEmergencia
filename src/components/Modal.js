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

import { RowingSharp } from '@material-ui/icons';

const BASE_URL = process.env.REACT_APP_ENV == 'production' ? 
process.env.REACT_APP_URL_PROD : 
process.env.REACT_APP_URL_DESA;

// const servicios = [
//   {
//     value: '07', //OMT
//     label: '7 días de tratamiento',
//   },
//   {
//     value: 'OM', //OMT
//     label: 'Orientación Médica Virtual',
//   },
//   {
//     value: 'AM', //TRAS
//     label: 'Atención Médica in-Situ',
//   },
//   {
//     value: 'SA', //AMDC
//     label: 'Traslado en Ambulancia',
//   },
//   {
//     value: 'LA', //HOMC
//     label: 'Laboratorio de Emergencia en casa',
//   },
//   {
//     value: 'RX', //NOSC
//     label: 'Rayos X en casa',
//   },
//   {
//     value: 'HO', //NOAP
//     label: 'Hospitalización Domicialiaria',
//   },
//   {
//     value: 'HO', //NOAP
//     label: '2da opinón Médica',
//   },
//   {
//     value: 'NA', //NOAP
//     label: 'No Aplica Atención',
//   },
//   {
//     value: 'NC', //NOAP
//     label: 'No se Pudo Contactar',
//   },
// ];

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
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
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({setOpen,open,rowsSelecc,setRows, setRowsAte, setRowsSelecc,setOpenA,setMsnAlert,setOpenBd}) {
  const [fila, setFila] = useState(false);
  const [observacion, setObservacion] = useState('');
  const [servicio, setServicio] = useState('');
  const [servicios, setServicios] = useState([])
  const hendleChangeObs = (event) => {
    setObservacion(event.target.value);
  };
  const atiendeSoli = async (row) => {
    const codUsuario = JSON.parse(sessionStorage.getItem("DATA")).CODUSR;
    const descPerf = JSON.parse(sessionStorage.getItem("DATA")).DESCPERFIL;
    
    if(servicio == ""){
      setMsnAlert("Debe ingresar el servicio prestado")
      setOpenA(true)
    }else if( observacion.length>500){
      setMsnAlert("La observación no debe superar los 500 caracteres")
      setOpenA(true)
    }else{
      setOpenBd(true)
      const res = await axios.post(`${BASE_URL}/BuscaSolicitud`, {
        "nIdSolicitud": row.id
      });
      // console.log(res)
      if(res.data.AtencionDomi_cur[0].STSSOLI == "ATE"){
        setOpenBd(false)
        setOpenA(true)
        setMsnAlert(`Ésta Solicitud ya fué atendida`)
        setOpenBd(true)
        const res = await axios.post(`${BASE_URL}/BuscaTodasSolicitudes`, {
          "cStsSoli": "0",
          "dFecDesde": "",
          "dFecHasta": "",
          "cCodUsr": "0"
        })
        const arrayRow = res.data.AtencionDomi_cur.map((item) => {
          return {
            id: item.IDSOLICITUD,
            NUMID: item.NUMID,
            NOMBRE: item.NOMBRE,
            DESCPAIS: item.DESCPAIS,
            DESCESTADO: item.DESCESTADO,
            DESCCIUDAD: item.DESCCIUDAD,
            DIRECCION: item.DIRECCION,
            PUNTOREFERENCIA: item.PUNTOREFERENCIA,
            CELULAR: item.CELULAR,
            TELEFHAB: item.TELEFHAB,
            STSSOLI: item.STSSOLI,
            FECSTS: item.FECSTS,
            CODUSR:item.CODUSR,
            NOMUSR:item.NOMUSR,
            FECREG: item.FECREG,
            LATITUD: item.LATITUD,
            LONGITUD: item.LONGITUD,
            EMPRESA: item.EMPRESA,
            DESCRIPATENCION: item.DESCRIPATENCION,
            INDCONTASESOR: item.INDCONTASESOR,
            OBSERVACION: item.OBSERVACION,
            DESCSTATUS: item.DESCSTATUS,
            EMAILASEG: item.EMAILASEG
          };
        })
        setRows(arrayRow.filter(ele => ele.STSSOLI != "ATE"))
        if(descPerf == "SUPERVISOR"){
          setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
       }else{ 
          setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
       }      await setOpen(false);
        setObservacion('')
        setOpenBd(false)
      }else{
        if(servicio == "NC"){
          const res = await axios.post(`${BASE_URL}/AtiendeSolicitud`, {
            "nIdSolicitud": row.id,
            "cStsSoli": "NCP",
            "cTipoAtencion": servicio,
            "cObservacion": observacion,
            "cCodUsr": codUsuario
          });
          const fetchData = async () => {
            const res = await axios.post(`${BASE_URL}/BuscaTodasSolicitudes`, {
              "cStsSoli": "0",
              "dFecDesde": "",
              "dFecHasta": "",
              "cCodUsr": "0"
            })
            const arrayRow = res.data.AtencionDomi_cur.map((item) => {
              return {
                id: item.IDSOLICITUD,
                NUMID: item.NUMID,
                NOMBRE: item.NOMBRE,
                DESCPAIS: item.DESCPAIS,
                DESCESTADO: item.DESCESTADO,
                DESCCIUDAD: item.DESCCIUDAD,
                DIRECCION: item.DIRECCION,
                PUNTOREFERENCIA: item.PUNTOREFERENCIA,
                CELULAR: item.CELULAR,
                TELEFHAB: item.TELEFHAB,
                STSSOLI: item.STSSOLI,
                FECSTS: item.FECSTS,
                CODUSR:item.CODUSR,
                NOMUSR:item.NOMUSR,
                FECREG: item.FECREG,
                LATITUD: item.LATITUD,
                LONGITUD: item.LONGITUD,
                EMPRESA: item.EMPRESA,
                DESCRIPATENCION: item.DESCRIPATENCION,
                INDCONTASESOR: item.INDCONTASESOR,
                OBSERVACION: item.OBSERVACION,
                DESCSTATUS: item.DESCSTATUS,
                EMAILASEG: item.EMAILASEG
              };
            })
            setRows(arrayRow.filter(ele => ele.STSSOLI != "ATE"))
            if(descPerf == "SUPERVISOR"){
              setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
           }else{ 
              setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
           }        setObservacion('')
            setRowsSelecc(fila)
            await setOpen(false);
            setOpenBd(false)
          }
        fetchData();
        }else{
          const res = await axios.post(`${BASE_URL}/AtiendeSolicitud`, {
            "nIdSolicitud": row.id,
            "cStsSoli": "ATE",
            "cTipoAtencion": servicio,
            "cObservacion": observacion,
            "cCodUsr": codUsuario
          });
          const fetchData = async () => {
            const res = await axios.post(`${BASE_URL}/BuscaTodasSolicitudes`, {
              "cStsSoli": "0",
              "dFecDesde": "",
              "dFecHasta": "",
              "cCodUsr": "0"
            })
            const arrayRow = res.data.AtencionDomi_cur.map((item) => {
              return {
                id: item.IDSOLICITUD,
                NUMID: item.NUMID,
                NOMBRE: item.NOMBRE,
                DESCPAIS: item.DESCPAIS,
                DESCESTADO: item.DESCESTADO,
                DESCCIUDAD: item.DESCCIUDAD,
                DIRECCION: item.DIRECCION,
                PUNTOREFERENCIA: item.PUNTOREFERENCIA,
                CELULAR: item.CELULAR,
                TELEFHAB: item.TELEFHAB,
                STSSOLI: item.STSSOLI,
                FECSTS: item.FECSTS,
                CODUSR:item.CODUSR,
                NOMUSR:item.NOMUSR,
                FECREG: item.FECREG,
                LATITUD: item.LATITUD,
                LONGITUD: item.LONGITUD,
                EMPRESA: item.EMPRESA,
                DESCRIPATENCION: item.DESCRIPATENCION,
                INDCONTASESOR: item.INDCONTASESOR,
                OBSERVACION: item.OBSERVACION,
                DESCSTATUS: item.DESCSTATUS,
                EMAILASEG: item.EMAILASEG
              };
            })
            setRows(arrayRow.filter(ele => ele.STSSOLI != "ATE"))
            if(descPerf == "SUPERVISOR"){
              setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
           }else{ 
              setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
           }        setObservacion('')
            setRowsSelecc(fila)
            await setOpen(false);
            setOpenBd(false)
          }
        fetchData();
        setServicio('');
        }
      }
    }
   
  }
  const desbloquearSoli = async (row) => {
    setOpenBd(true)
    const codUsuario = JSON.parse(sessionStorage.getItem("DATA")).CODUSR;
    const descPerf = JSON.parse(sessionStorage.getItem("DATA")).DESCPERFIL;
    const res = await axios.post(`${BASE_URL}/BuscaSolicitud`, {
      "nIdSolicitud": row.id
    });
    if(res.data.AtencionDomi_cur[0].STSSOLI == "ATE"){
      setOpenA(true)
      setMsnAlert(`Ésta Solicitud ya fué atendida`)
      const res = await axios.post(`${BASE_URL}/BuscaTodasSolicitudes`, {
        "cStsSoli": "0",
        "dFecDesde": "",
        "dFecHasta": "",
        "cCodUsr": "0"
      })
      const arrayRow = res.data.AtencionDomi_cur[0].map((item) => {
        return {
          id: item.IDSOLICITUD,
          NUMID: item.NUMID,
          NOMBRE: item.NOMBRE,
          DESCPAIS: item.DESCPAIS,
          DESCESTADO: item.DESCESTADO,
          DESCCIUDAD: item.DESCCIUDAD,
          DIRECCION: item.DIRECCION,
          PUNTOREFERENCIA: item.PUNTOREFERENCIA,
          CELULAR: item.CELULAR,
          TELEFHAB: item.TELEFHAB,
          STSSOLI: item.STSSOLI,
          FECSTS: item.FECSTS,
          CODUSR:item.CODUSR,
          NOMUSR:item.NOMUSR,
          FECREG: item.FECREG,
          LATITUD: item.LATITUD,
          LONGITUD: item.LONGITUD,
          EMPRESA: item.EMPRESA,
          DESCRIPATENCION: item.DESCRIPATENCION,
          INDCONTASESOR: item.INDCONTASESOR,
          OBSERVACION: item.OBSERVACION,
          NOMBRE_INTER: item.NOMBRE_INTER,
          CELULARASESOR: item.CELULARASESOR,
          DESCSTATUS: item.DESCSTATUS,
          EMAILASEG: item.EMAILASEG
          
        };
      })
      setRows(arrayRow.filter(ele => ele.STSSOLI != "ATE"))
      if (descPerf == "SUPERVISOR") {
        setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
      } else {
        setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
      } setObservacion('')
      await setOpen(false);
      setOpenBd(false)
    }else{
        const res1 = await axios.post(`${BASE_URL}/AtiendeSolicitud`, {
          "nIdSolicitud": rowsSelecc.id,
          "cStsSoli": "PEN",
          "cTipoAtencion": "",
          "cObservacion": "",
          "cCodUsr": ""
        });
        const res = await axios.post(`${BASE_URL}/BuscaTodasSolicitudes`, {
          "cStsSoli": "0",
          "dFecDesde": "",
          "dFecHasta": "",
          "cCodUsr": "0"
        })
        const arrayRow = res.data.AtencionDomi_cur.map((item) => {
          return {
            id: item.IDSOLICITUD,
            NUMID: item.NUMID,
            NOMBRE: item.NOMBRE,
            DESCPAIS: item.DESCPAIS,
            DESCESTADO: item.DESCESTADO,
            DESCCIUDAD: item.DESCCIUDAD,
            DIRECCION: item.DIRECCION,
            PUNTOREFERENCIA: item.PUNTOREFERENCIA,
            CELULAR: item.CELULAR,
            TELEFHAB: item.TELEFHAB,
            STSSOLI: item.STSSOLI,
            FECSTS: item.FECSTS,
            CODUSR:item.CODUSR,
            NOMUSR:item.NOMUSR,
            FECREG: item.FECREG,
            LATITUD: item.LATITUD,
            LONGITUD: item.LONGITUD,
            EMPRESA: item.EMPRESA,
            DESCRIPATENCION: item.DESCRIPATENCION,
            INDCONTASESOR: item.INDCONTASESOR,
            OBSERVACION: item.OBSERVACION,
            NOMBRE_INTER: item.NOMBRE_INTER,
            CELULARASESOR: item.CELULARASESOR,
            DESCSTATUS: item.DESCSTATUS,
            EMAILASEG: item.EMAILASEG
          };
        })
        setRows(arrayRow.filter(ele => ele.STSSOLI != "ATE"))
      if (descPerf == "SUPERVISOR") {
        setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
      } else {
        setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
      } await setOpen(false);
      setObservacion('')
      setOpenBd(false)
    }
  }
  
  useEffect(() => {
    setFila(rowsSelecc)

    const obtenerServiciosPrestados = async() => {
      //const {data} = await axios.post(`${BASE_URL}/BuscarTipoSolAtencion`)//BuscarTipotencion
     // https://segurospiramide.com/asg-api/dbo/buzon_asistencia/BuscarTipoSolAtencion
    //  await axios.post(`https://segurospiramide.com/asg-api/dbo/buzon_asistencia/BuscarTipoSolAtencion`)
     const {data} = await axios.post(`${BASE_URL}/BuscarTipoSolAtencion`)
      setServicios(data.Datos_cur)
    }
    obtenerServiciosPrestados()
  }, [])

  return (
    <div>
      <Dialog id="Modal" onClose={() => desbloquearSoli(rowsSelecc)} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle style={{ backgroundColor: "#3f51b5", color: "white" }} id="customized-dialog-title" onClose={() => desbloquearSoli(rowsSelecc)}>
          Solicitud Nro: {rowsSelecc.id}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {/* //Empresa, Solicitud, Registro */}
            <Grid item xs={4}>
              <TextField
                label="EMPRESA"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.EMPRESA}
                disabled="true"
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                style={{ width: "100%" }}
                label="FECHA SOLICITUD"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.FECSTS}
                disabled="true"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                style={{ width: "100%" }}
                label="FECHA REGISTRO"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.FECREG}
                disabled="true"
              />
            </Grid>
             {/* //CI, Nombre, telefono, celular, telefonos */}
            <Grid item xs={4}>
              <TextField
  style={{ width: "100%" }}
                label="CEDULA"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.NUMID}
                disabled="true"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="NOMBRE"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.NOMBRE}
                disabled="true"
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
  style={{ width: "100%" }}
                label="CELULAR"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.CELULAR}
                disabled="true"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
  style={{ width: "100%" }}
                label="TELEFONO"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.TELEFHAB}
                disabled="true"
              />
            </Grid>
         
            {/* //asesor, telefonos */}
            <Grid item xs={4}>
              <TextField
                label="ASESOR"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.NOMBRE_INTER}
                disabled="true"
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
  style={{ width: "100%" }}
                label="TELF ASESOR"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.CELULARASESOR}
                disabled="true"
              />
            </Grid>

           {/* //estado, ciudad, pto de referencia */}
            <Grid item xs={4}>
              <TextField
  style={{ width: "100%" }}
                label="ESTADO"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.DESCESTADO}
                disabled="true"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="CIUDAD"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.DESCCIUDAD}
                disabled="true"
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                multiline
                style={{ width: "100%" }}
                label="PTO. REFERENCIA"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.PUNTOREFERENCIA}
                disabled="true"
                style={{ width: "100%" }}
              />
            </Grid>

           {/* Direccion pto ref*/}
           <Grid item xs={12}>
              <TextField
                multiline

                label="DIRECCION"
                type="text"
                autoComplete="current-password"
                value={rowsSelecc.DIRECCION}
                disabled="true"
                style={{ width: "100%" }}
              />
            </Grid>
           
           {/* observacion servicios*/}
            <Grid item xs={6}>
              <TextField
                multiline

                label="Observacion"
                type="text"
                autoComplete="current-password"
                value={observacion}
                onChange={hendleChangeObs}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-select-currency"
                select
                onChange={(e) => {
                  setServicio(e.target.value)
                }}
                label="Servicio Prestado"
                style={{ width: "100%" }}
              >
                {servicios.map((option) => (
                  <MenuItem key={option.CODIGO} value={option.CODIGO}>
                    {option.DESCRIPCION}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

              
        </DialogContent>
        <DialogActions id="btnModal">
          <Button onClick={() => atiendeSoli(rowsSelecc)} >
            Actualizar Solicitud
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}