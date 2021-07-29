import React, { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext/AuthContext";
import Paper from "@material-ui/core/Paper";
import Logo from "../logoAlo.png";
import HttpsIcon from "@material-ui/icons/Https";
import AutorenewIcon from '@material-ui/icons/Autorenew';

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
    borderRadius: "50px",
  },
}));

const ChangePassword = (props) => {
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
    const res = await axios.post(
      "https://emergencia24horas.segurospiramide.com/node/express/servicios/api/ValidarRegistro",
      { cCodUsr: user.cCodUsr }
    );
    if (res.data[0].RESULTADO == "S") {
    //  https://emergencia24horas.segurospiramide.com/node/express/servicios
    //  alert(res.data[0].OBSER)
      await setActPass(false)
      await setActBtn(false)
    } else {
    //  alert(JSON.stringify(res.data[0].OBSER))
     setOpen(true)
     setMsnAlert(res.data[0].OBSER)
      await setActPass(true)
      await setActBtn(true)
    }
  };

  const onSubmit =async (e) => {
    e.preventDefault();
    //login(user);
    const res = await axios.post(
      "https://emergencia24horas.segurospiramide.com/node/express/servicios/api/AutenticarUsuario",
      user
    );
    await sessionStorage.setItem("DATA",JSON.stringify(res.data.data))
    await sessionStorage.setItem("TOKEN",JSON.stringify(res.data.token))
    await props.history.push('/Home')
  };

  return (
    <div className="fondo">
      <Alerta open={open} setOpen={setOpen} msnAlert={msnAlert}/>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          // elevation={24}
          style={{ width: 400, marginTop: "3%", padding: 20 }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AutorenewIcon fontSize="large" style={{ color: "#c15b2a" }} />
            {/*  47c0b6-c15b2a*/}
          </div>
          <form onSubmit={onSubmit} noValidate autoComplete="off">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={Logo} style={{ width: 150 }} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <TextField
                label="Contraseña Actual"
                type="text"
                variant="outlined"
                name="cCodUsr"
                onChange={onChange}
                color="primary"
                className={classes.root}
                id="nombUser"
                onBlur={onBlur}
                fullWidth
              />
              <TextField
                label="Contraseña Nueva"
                type="password"
                variant="outlined"
                name="cPassword"
                color="primary"
                onChange={onChange}
                className={`${classes.root} ${classes.text}`}
                disabled={actPass}    
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                // startIcon={<CloudUploadIcon />}
                className={classes.btn}
                disabled={actBtn}  
                fullWidth
              >
                Actualizar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
