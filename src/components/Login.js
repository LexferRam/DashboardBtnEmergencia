import React, { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext/AuthContext";
import Paper from "@material-ui/core/Paper";
import Logo from "../alojose.png";
import LogoPira from "../logopira.svg";
import LogoOcea from "../logoocea.png";
import HttpsIcon from "@material-ui/icons/Https";
import { Button, TextField } from "@material-ui/core";
import "../App.css";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from 'axios'
import Alerta from "./Alerta"

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "20px",
    width: "100%",
  },
  text: {
    marginBottom: 25,
  },
  btn: {
    marginBottom: 30,
    borderRadius: "50",
  },
}));

const BASE_URL = process.env.REACT_APP_ENV == 'production' ? 
process.env.REACT_APP_URL_PROD : 
process.env.REACT_APP_URL_DESA;

const Login = (props) => {
  const classes = useStyles();
  const { login,
    codUser,
    descPerf,
    userId,
    nomAuth,
    userStatus } = useContext(AuthContext);
  const [user, setUser] = useState({ cCodUsr: "", cPassword: "" });

  const [actPass, setActPass] = useState(true);
  const [actBtn, setActBtn] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [msnAlert, setMsnAlert] = React.useState("");

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onBlur = async (e) => {
    if(!user.cCodUsr) return
    const res = await axios.post(
      `${BASE_URL}/ValidarRegistro`,
      { cCodUsr: user.cCodUsr }
    );
    if (res.data.C_Datos[0].OBSER == null ) {
      setOpen(true)
      setMsnAlert('USUARIO INVALIDO')
      return;
    }
    if (res.data.C_Datos[0].RESULTADO == "S") {
      await setActPass(false)
      await setActBtn(false)
    } else {
     setOpen(true)
     setMsnAlert(res.data.C_Datos[0].OBSER)
      await setActPass(true)
      await setActBtn(true)
    }
  };

  const onSubmit =async (e) => {
    e.preventDefault();

    const res = await axios.post(
      `${BASE_URL}/AutenticarUsuario`,
      user
    );
  
    console.log(res)
    if(res.data.C_Datos[0].PASSWORD == user.cPassword){
      await sessionStorage.setItem("DATA",JSON.stringify(res.data.C_Datos[0]))
      await sessionStorage.setItem("TOKEN",JSON.stringify(res.data.C_Datos[0].token))
      await props.history.push('/Home')
    }else{
      setOpen(true)
      setMsnAlert('CONTRASEÑA INVALIDA')
    }
    
  };

  return (
    <div className="fondo">
      <Alerta open={open} setOpen={setOpen} msnAlert={msnAlert}/>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={24}
          style={{ width: 400, marginTop: "8%", padding: 20 }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <HttpsIcon fontSize="large" style={{ color: "#c15b2a" }} />
            {/*  47c0b6-c15b2a*/}
          </div>
          <form onSubmit={onSubmit} noValidate autoComplete="off">
              <div style={{ display: "flex", justifyContent: "center",flexDirection:'row', margin:20}}>
                <img src={LogoPira} style={{ width: 170 }} />
                <img src={LogoOcea} style={{ width: 170 }} />
              </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                label="Nombre de Usuario"
                type="text"
                variant="outlined"
                name="cCodUsr"
                onChange={onChange}
                color="primary"
                className={classes.root}
                id="nombUser"
                onBlur={onBlur}
              />
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                name="cPassword"
                color="primary"
                onChange={onChange}
                className={`${classes.root} ${classes.text}`}
                disabled={actPass}    
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                // startIcon={<CloudUploadIcon />}
                className={classes.btn}
                disabled={actBtn}  
              >
                Ingresar
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
