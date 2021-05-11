import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop } from '@material-ui/core';

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
const AuthState = (props) => {
  const classes = useStyles();
  const [codUser, setCodUser] = useState("");
  const [descPerf, setDescPerf] = useState("");
  const [userId, setUserId] = useState("");
  const [nomAuth, setNomAuth] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [token, setToken] = useState("");

  const [isLoaded, setIsLoaded] = useState(true);
  

  const login = async (user) => {
    setIsLoaded(false);
    const res = await axios.post(
      "https://emergencia24horas.segurospiramide.com/node/express/servicios/api/AutenticarUsuario",
      user
    );
    await sessionStorage.setItem("DATA",JSON.stringify(res.data.data))
    localStorage.setItem("TOKEN",JSON.stringify(res.data.token))
    //NO HACE FALTA
    setCodUser(res.data.data.CODUSR)
    setDescPerf(res.data.data.DESCPERFIL);
    setUserId(res.data.data.IDPERFIL);
    setNomAuth(res.data.data.NOMUSR);
    setUserStatus(res.data.data.STSUSR);

    setIsLoaded(true);
  }

  const estaAutenticado = async (user) => {
    // setIsLoaded(false);
    const res = await axios.post(
      "https://emergencia24horas.segurospiramide.com/node/express/servicios/api/autenticado",
      {},
           localStorage.getItem("TOKEN")
      
    );

  }
 

  return (
    <div>
      {!isLoaded ? (

        <Backdrop className={classes.backdrop} open={true} >
          <CircularProgress color="inherit" />
        </Backdrop>

      ) : (
        <AuthContext.Provider
          value={{
            login,
            codUser,
            descPerf,
            userId,
            nomAuth,
            userStatus,
            estaAutenticado
          }}
        >
          {props.children}
        </AuthContext.Provider>
      )}
    </div>
  );
};

export default AuthState;
