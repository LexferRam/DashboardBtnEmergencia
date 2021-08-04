import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from "axios"
import CheckIcon from '@material-ui/icons/Check';
///-----------------------------------------------------------
import IconButton from '@material-ui/core/IconButton';
import { Backdrop, Button, TablePagination, TextField, Typography } from '@material-ui/core';
///-----------------------------------------------------------
import AuthContext from "../Context/AuthContext/AuthContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from "./Modal"
import ModalMapa from "./ModalMapa"
import AlertDialog from './Alerta';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';
import ExportarExcel from './BtnExcel/Exportarexcel';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Tooltip from '@material-ui/core/Tooltip';
import ModalObs from './ModalObs';
import "../App.css"
import BotonesAppsExternas from './BotonesLinksApps'
//SWR
import useSWR from 'swr'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 999999,
    color: '#fff',
  },
  table: {
    width: "100%",
  },
  none: {
    display: 'none'
  },
  button: {
    height: "30px !important",
    borderRadius: 50,
    margin: "20px 0px 0px 20px",
    fontSize: 10
  }
}));

function Documentos(props) {
  const [rowsPend, setRows] = useState([])
  const [rowsAte, setRowsAte] = useState([])
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [pageAte, setPageAte] = useState(0);
  const [rowsPerPageAte, setRowsPerPageAte] = useState(6);
  const [rowsSelecc, setRowsSelecc] = useState({});
  //modall
  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  // const [load, setLoad] = useState(false);
  const [openBd, setOpenBd] = useState(false);
  const [openA, setOpenA] = React.useState(false);
  const [msnAlert, setMsnAlert] = React.useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAte, setBusquedaAte] = useState("");
  const [openObs, setOpenObs] = useState(false);

  
  const descPerf =sessionStorage.getItem("DATA") ? JSON.parse(sessionStorage.getItem("DATA")).DESCPERFIL : null;
  const codUsuario =sessionStorage.getItem("DATA") ? JSON.parse(sessionStorage.getItem("DATA")).CODUSR : null;
  const nomusr =sessionStorage.getItem("DATA") ? JSON.parse(sessionStorage.getItem("DATA")).NOMUSR : null;
  
  
  //SWR
  const fetcher = url => axios.post('https://emergencia24horas.segurospiramide.com/node/express/servicios/api/BuscaTodasSolicitudes',{
    "cStsSoli": 0,
    "dFecDesde": "",
    "dFecHasta": "",
    "cCodUsr": "0"
  }).then(res => res.data)

  const {data} = useSWR('/api/BuscaTodasSolicitudes',fetcher,{refreshInterval:5000})
  const dataOrdenada = data?.sort( (a, b) => a - b )
  const arrayRow = dataOrdenada?.map((item) => {
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
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$'+JSON.stringify(arrayRow)) 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePageAte = (event, newPage) => {
    setPageAte(newPage);
  };

  const handleChangeRowsPerPageAte = (event) => {
    setRowsPerPageAte(+event.target.value);
    setPageAte(0);
  };

  const rowSelect = (row) => {
    setRowsSelecc(row); 
  }
  const bloqueaSoli = async (row) => {
    const usuarioautenticado = JSON.parse(sessionStorage.getItem("DATA")).NOMUSR;
    const codUsuario = JSON.parse(sessionStorage.getItem("DATA")).CODUSR;
    const descPerf = JSON.parse(sessionStorage.getItem("DATA")).DESCPERFIL;
   
    setOpenBd(true)
    const res = await axios.post("https://emergencia24horas.segurospiramide.com/node/express/servicios/api/BuscaSolicitud", {
      "nIdSolicitud": row.id
    });
    if(res.data[0].STSSOLI == "ATE"){
      setOpenBd(false)
      setOpenA(true)
      setMsnAlert(`Ésta Solicitud ya fué atendida`)
    }
    else if(res.data[0].STSSOLI == "PEN" || descPerf == "SUPERVISOR" || res.data[0].CODUSR == codUsuario){
      setOpenBd(false)
      setOpen(true);
      const res = await axios.post("https://emergencia24horas.segurospiramide.com/node/express/servicios/api/AtiendeSolicitud", {
        "nIdSolicitud": row.id,
        "cStsSoli": "BLO",
        "cTipoAtencion": "",
        "cObservacion": "",
        "cCodUsr": codUsuario
      });
      const fetchData = async () => {
        const res = await axios.post('https://emergencia24horas.segurospiramide.com/node/express/servicios/api/BuscaTodasSolicitudes', {
          "cStsSoli": 0,
          "dFecDesde": "",
          "dFecHasta": "",
          "cCodUsr": "0"
        })
        const arrayRow = res.data.map((item) => {
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
            FECREG: item.FECREG,
            CODUSR:item.CODUSR,
            NOMUSR:item.NOMUSR,
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
        if(descPerf == "SUPERVISOR"){
          setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
       }else{ 
          setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
       }
      }
      fetchData();
    }else{
      setOpenBd(false)
      setOpenA(true)
      setMsnAlert(`Solicitud bloqueada por ${res.data[0].NOMUSR}`)
      const fetchData = async () => {
        const res = await axios.post(process.env.REACT_APP_BASE_API_URL+'/api/BuscaTodasSolicitudes', {
          "cStsSoli": 0,
          "dFecDesde": "",
          "dFecHasta": "",
          "cCodUsr": "0"
        })
        const arrayRow = res.data.map((item) => {
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
            FECREG: item.FECREG,
            CODUSR:item.CODUSR,
            NOMUSR:item.NOMUSR,
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
        if(descPerf == "SUPERVISOR"){
          setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP"))
       }else{ 
          setRowsAte(arrayRow.filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.CODUSR == codUsuario && ele.STSSOLI != "NCP"))
       }
      }
      fetchData();
    }
  }
  const abrirMapa =async () =>{
    setOpenMap(true)
  }
  const onChange = (e) => {
    setBusqueda(e.target.value)
  }
  const onChangeAte = (e) => {
    setBusquedaAte(e.target.value)
  }

  return (
      <>
       <AlertDialog open={openA} setOpen={setOpenA} msnAlert={msnAlert}/>
       <ModalObs openObs={openObs} setOpenObs={setOpenObs} msnAlert={msnAlert}/>
      <Backdrop className={classes.backdrop} open={openBd} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        setOpen={setOpen}
        open={open}
        rowsSelecc={rowsSelecc}
        setRowsSelecc={setRowsSelecc}
        setRows={setRows}
        setRowsAte={setRowsAte}
        setOpenA={setOpenA}
        setMsnAlert={setMsnAlert}
        setOpenBd={setOpenBd}
      />
      <ModalMapa setOpenMap={setOpenMap} openMap={openMap} rowsSelecc={rowsSelecc} />
      <div style={{ margin: 15, color: '#396388' }}>
        <BotonesAppsExternas />
        <Typography variant="h6" noWrap style={{ color: '#396388', textTransform: "uppercase", marginTop: 30 }}>
            Solicitudes Pendientes
        </Typography>
        <div style={{ display: 'flex' }}>
          <form noValidate autoComplete="off" style={{ marginTop: 10 }}>
            <TextField
              name="busqueda"
              value={busqueda}
              onChange={onChange}
              label="Buscar"
              // variant="outlined"
              type="text"
            />
          </form>
          {/* <BtnExcel rowsPend={rowsPend} /> */}
          <ExportarExcel 
          titulo="Solicitudes Pendientes" 
          enviarjsonGrid={rowsPend} />
        </div>
      </div>
      <TableContainer component={Paper} style={{boxShadow: "10px 10px 10px 0 rgb(0 0 0 / 12%)"}}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nro. Solicitud</TableCell>
              <TableCell align="center" className={classes.none}>Estatus solicitud</TableCell>
              <TableCell align="center" >Estatus solicitud</TableCell>
              <TableCell align="center" >Operador</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center" className={classes.none}>Contactar Asesor</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Ciudad</TableCell>
              <TableCell align="center">Dirección</TableCell>
              <TableCell align="center" >Fecha Registro</TableCell>
              <TableCell align="center" >Fecha Estatus</TableCell>
              <TableCell align="center" >Empresa</TableCell>
              <TableCell align="center">Acciones</TableCell>
              <TableCell align="center" className={classes.none} >Asesor</TableCell>
              <TableCell align="center" className={classes.none}>Telf Asesor</TableCell>
              
              <TableCell align="center" className={classes.none}>Celular</TableCell>
              <TableCell align="center" className={classes.none}>Telf.Habitación</TableCell>
              <TableCell align="center" className={classes.none}>C.I</TableCell>
              <TableCell align="center" className={classes.none}>Latitud</TableCell>
              <TableCell align="center" className={classes.none}>Longitud</TableCell>
              <TableCell align="center" className={classes.none}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table">
            {/* {rowsPend.map((row) => ( */}
            {arrayRow?.filter(ele => ele.STSSOLI != "ATE")?.filter((item) =>{
              if(busqueda == ""){
                return item
              }else if(
                // alert(item.DESCSTATUS)
                item.id.toString().includes(busqueda) ||
                JSON.stringify(item.DESCSTATUS).includes(busqueda.toUpperCase()) || //STSSOLI
                JSON.stringify(item.STSSOLI).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.NOMUSR).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.NOMBRE).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.INDCONTASESOR).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.DESCESTADO).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.DESCCIUDAD).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.DIRECCION).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.FECREG).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.FECSTS).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.EMPRESA).includes(busqueda.toUpperCase()) 
                ){
                return item
              }
            }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" className={classes.none}>
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.DESCSTATUS}</TableCell>
                  <TableCell align="center" >{
                  row.STSSOLI== "NCP" ? ("NO SE PUDO CONTACTAR"):row.STSSOLI== "PEN" ? ("PENDIENTE"):("BLOQUEADO")
                  }</TableCell>
                  <TableCell align="center">{row.NOMUSR}</TableCell>
                  <TableCell align="center">{row.NOMBRE}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.INDCONTASESOR == "S" ? ("Si"):("No")}</TableCell>
                  <TableCell align="center">{row.DESCESTADO}</TableCell>
                  <TableCell align="center">{row.DESCCIUDAD}</TableCell>
                  <TableCell align="center" >{row.DIRECCION}</TableCell>
                  <TableCell align="center" >{row.FECREG}</TableCell>
                  <TableCell align="center" >{row.FECSTS}</TableCell>
                  {row.EMPRESA === "PIRAMIDE" ? (
                  <TableCell align="center" style={{color:"red"}} >
                    {row.EMPRESA}
                  </TableCell>
                  ):(
                  <TableCell align="center" style={{color:"blue"}}>
                    {row.EMPRESA}
                  </TableCell>
                  )}
                 
                 <TableCell align="center" className={classes.none}>{row.NOMBRE_INTER}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.CELULARASESOR}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.NUMID}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.PUNTOREFERENCIA}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.CELULAR}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.TELEFHAB}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.STSSOLI}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.LATITUD}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.LONGITUD}</TableCell>
                  <TableCell align="center" style={{display:"flex", justifyContent:"space-between"}} >
                    <IconButton aria-label="descargar" size="small" onClick={() => {
                      rowSelect(row)
                      bloqueaSoli(row)
                    }}>
                      <Tooltip title="Atender Solicitud">
                        <CreateIcon size="small" color="primary" />
                      </Tooltip>
                    </IconButton>
                    <IconButton aria-label="descargar" size="small" onClick={() => {
                      rowSelect(row)
                      abrirMapa()
                    }}>
                      {/* LocationOnIcon */}
                      <Tooltip title="Ubicación Geográfica">
                        <LocationOnIcon size="small" color="primary" />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
            {/* ))} */}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 30]}
          component="div"
          
          count={arrayRow?.filter(ele => ele.STSSOLI != "ATE")?.filter((item) =>{
              if(busqueda == ""){
                return item
              }else if(
                item.id.toString().includes(busqueda) ||
                JSON.stringify(item.DESCSTATUS).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.NOMUSR).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.NOMBRE).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.INDCONTASESOR).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.DESCESTADO).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.DESCCIUDAD).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.DIRECCION).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.FECREG).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.FECSTS).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.STSSOLI).includes(busqueda.toUpperCase()) ||
                JSON.stringify(item.EMPRESA).includes(busqueda.toUpperCase())   
                ){
                return item
              }
            }).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      
      {/* ////////////////////////////////////////////// */}
      <div style={{ margin: 15, color: '#396388'  }}>
        <Typography variant="h6" noWrap style={{ color: '#396388',textTransform:"uppercase" }}>
          Solicitudes Atendidas
       </Typography>
       <div style={{ display: 'flex' }}>
          <form noValidate autoComplete="off" style={{ marginTop: 10 }}>
            <TextField
              name="busquedaAte"
              value={busquedaAte}
              onChange={onChangeAte}
              label="Buscar"
              // variant="outlined"
              type="text"
            />
          </form>
          {/* <BtnExcelAte rowsAte={rowsAte}/>  */}
          <ExportarExcel 
            titulo="Solicitudes Atendidas" 
            enviarjsonGrid={rowsAte} 
          />
       </div>
       
      </div>
      <TableContainer component={Paper} style={{boxShadow: "10px 10px 10px 0 rgb(0 0 0 / 12%)"}}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
            <TableCell align="center">Nro. Solicitud</TableCell>
              <TableCell align="center" className={classes.none}>Estatus solicitud</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Operador</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Ciudad</TableCell>
              <TableCell align="center">Dirección</TableCell>
              <TableCell align="center" >Fecha Registro</TableCell>
              <TableCell align="center" >Fecha Estatus</TableCell>
              <TableCell align="center" >Empresa</TableCell>
              <TableCell align="center" >Servicio Prestado</TableCell>
              <TableCell align="center">Celular</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center" >Observación</TableCell>
              <TableCell align="center" className={classes.none}>Telf.Habitación</TableCell>
              <TableCell align="center" className={classes.none}>C.I</TableCell>
              <TableCell align="center" className={classes.none}>Latitud</TableCell>
              <TableCell align="center" className={classes.none}>Longitud</TableCell>
              <TableCell align="center" className={classes.none}>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table">
            {arrayRow?.filter(ele => descPerf == 'SUPERVISOR' ?
             ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP" :
             ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP" && ele.NOMUSR == nomusr
             )
            .filter((item) =>{
              if(busquedaAte == ""){
                return item
              }else if(
                item.id.toString().includes(busquedaAte) ||
                JSON.stringify(item.DESCSTATUS).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.NOMUSR).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.NOMBRE).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.INDCONTASESOR).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.DESCESTADO).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.DESCCIUDAD).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.DIRECCION).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.FECREG).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.FECSTS).includes(busquedaAte.toUpperCase()) ||
                JSON.stringify(item.EMPRESA).includes(busquedaAte.toUpperCase()) 
                ){
                return item
              }
            }).slice(pageAte * rowsPerPageAte, pageAte * rowsPerPageAte + rowsPerPageAte).map((row) => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" className={classes.none}>
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.STSSOLI}</TableCell>
                  <TableCell align="center">{row.NOMBRE}</TableCell>
                  <TableCell align="center">{row.NOMUSR}</TableCell>
                  <TableCell align="center">{row.DESCESTADO}</TableCell>
                  <TableCell align="center">{row.DESCCIUDAD}</TableCell>
                  <TableCell align="center" >{row.DIRECCION}</TableCell>
                  <TableCell align="center" >{row.FECREG}</TableCell>
                  <TableCell align="center" >{row.FECSTS}</TableCell>
                  {row.EMPRESA === "PIRAMIDE" ? (
                  <TableCell align="center" style={{color:"red"}} >
                    {row.EMPRESA}
                  </TableCell>
                  ):(
                  <TableCell align="center" style={{color:"blue"}}>
                    {row.EMPRESA}
                  </TableCell>
                  )}
                 <TableCell align="center">{row.DESCRIPATENCION}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.NUMID}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.PUNTOREFERENCIA}</TableCell>
                  <TableCell align="center" >{row.CELULAR}</TableCell>
                  <TableCell align="center" >{row.EMAILASEG}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.TELEFHAB}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.STSSOLI}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.LATITUD}</TableCell>
                  <TableCell align="center" className={classes.none}>{row.LONGITUD}</TableCell>
                  <TableCell align="center" >
                    <IconButton aria-label="descargar" size="small" onClick={() => {
                      // rowSelect(row)
                      if(!row.OBSERVACION){
                        setMsnAlert("Solicitud Atendida sin Observación")
                        setOpenA(true)
                      }else{
                        setMsnAlert(row.OBSERVACION)
                        setOpenObs(true)
                      }
                    }}>
                      <SearchIcon size="small" color="primary" />
                    </IconButton>
                  </TableCell>
                  
                </TableRow>
              )
            })}
            {/* ))} */}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 30]}
          component="div"
          count={arrayRow?.filter(ele => descPerf == 'SUPERVISOR' ?
          ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP" :
          ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP" && ele.NOMUSR == nomusr
          )
          .filter(ele => ele.STSSOLI != "PEN" && ele.STSSOLI != "BLO" && ele.STSSOLI != "NCP").filter((item) =>{
            if(busquedaAte == ""){
              return item
            }else if(
              item.id.toString().includes(busquedaAte) ||
              JSON.stringify(item.DESCSTATUS).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.NOMUSR).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.NOMBRE).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.INDCONTASESOR).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.DESCESTADO).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.DESCCIUDAD).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.DIRECCION).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.FECREG).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.FECSTS).includes(busquedaAte.toUpperCase()) ||
              JSON.stringify(item.EMPRESA).includes(busquedaAte.toUpperCase())   
              ){
              return item
            }
          }).length}
          rowsPerPage={rowsPerPageAte}
          page={pageAte}
          onChangePage={handleChangePageAte}
          onChangeRowsPerPage={handleChangeRowsPerPageAte}
        />
      </TableContainer>
    </>
   
)}
    

export default Documentos
