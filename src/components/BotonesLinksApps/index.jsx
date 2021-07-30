import React from 'react'
import BtnOcea from '../../SOSOceanica.jpg'
import BtnPira from '../../SOSpiramide.jpg'
import logoPira from '../../logo_piramide2.png'
import logoOcea from '../../LogoOceanica2.png'
import Apira from '../../Apira.jpg'
import Aocea from '../../Aocea.jpg'
import { ButtonBase,Typography, Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';


export default function(){
    return (
        <div style={{ display: 'flex', flexDirection:'row', justifyContent:'space-around',marginRight:"9%" }}>
            {/* <div style={{marginRight:"9%"}}> */}
              <a href="https://emergencia24hsegurospiramide.web.app/" target="_blank" style={{textDecoration:'none'}}>
                {/* <ButtonBase>
                  <Tooltip title="Botón de emergencia Pirámide Seguros ">
                      <img src={BtnPira} style={{ width:30,margin:5,height:30 }}/>
                  </Tooltip>
                </ButtonBase> */}
                <Button
                  variant="outlined"
                  color="default"
                  size="small"
                  // className={classes.button}
                  startIcon={<img src={BtnPira} 
                  style={{ width:30,margin:5,height:30}} />}
                  style={{ fontSize:10, borderRadius:"50px"}}
                >
                  Ingresar Nuevos Casos
                </Button>
              </a>

              <a href="https://emergencia24hoceanicadeseguros.web.app/" target="_blank" style={{textDecoration:'none'}}>
                {/* <ButtonBase>
                  <Tooltip title="Botón de emergencia Oceánica de Seguros ">
                    <img src={BtnOcea} style={{ width:30,margin:5,height:30 }}/>
                    </Tooltip>
                </ButtonBase> */}
                <Button
                  size="small"
                  variant="outlined"
                  color="default"
                  // className={classes.button}
                  startIcon={<img src={BtnOcea} 
                  style={{ width:30,margin:5,height:30}} />}
                  style={{ fontSize:10, borderRadius:"50px"}}
                >
                  Ingresar Nuevos Casos
                </Button>
              </a>

              <a href="https://asegurabilidadsegurospiramide.web.app/" target="_blank" style={{textDecoration:'none'}}>
              {/* <ButtonBase>
                <Tooltip title="Consulta de asegurabilidad Seguros Pirámide">
                  <img src={logoPira} style={{ width:50,margin:5,height:40 }}/>
                </Tooltip>
              </ButtonBase> */}
              <Button
                  size="small"
                  variant="outlined"
                  color="default"
                  // className={classes.button}
                  startIcon={<img src={logoPira} 
                  style={{ width:30,margin:5,height:30}} />}
                  style={{ fontSize:10, borderRadius:"50px"}}
                >
                 Consulta Asegurabilidad
                </Button>
              </a>

              <a href="https://asegurabilidadoceanica.web.app/" target="_blank" style={{textDecoration:'none'}}>
              {/* <ButtonBase>
                <Tooltip title="Consulta de asegurabilidad Oceánica de Seguros">
                  <img src={logoOcea} style={{ width:50,margin:5,height:45 }}/>
                </Tooltip>
              </ButtonBase> */}
              <Button
                  size="small"
                  variant="outlined"
                  color="default"
                  // className={classes.button}
                  startIcon={<img src={logoOcea} 
                  style={{ width:30,margin:5,height:30}} />}
                  style={{ fontSize:10, borderRadius:"50px"}}
                >
                 Consulta Asegurabilidad
                </Button>
              </a>

              <a href="http://186.24.0.86:7777/forms/frmservlet?config=piramide" target="_blank" style={{textDecoration:'none'}}>
              {/* <ButtonBase>
                <Tooltip title="Ir a Sistema de ACSEL Pirámide">
                  <img src={Apira} style={{ width:60,height:50 }}/>
                </Tooltip>
              </ButtonBase> */}
              <Button
                  size="small"
                  variant="outlined"
                  color="default"
                  // className={classes.button}
                  startIcon={<img src={Apira} 
                  style={{ width:30,margin:5,height:30}} />}
                  style={{ fontSize:10, borderRadius:"50px"}}
                >
                 Ir ACSEL Pirámide
                </Button>
              </a>

              <a href="http://186.24.0.86:7777/forms/frmservlet?config=oceanica" target="_blank" style={{textDecoration:'none'}}>
                {/* <ButtonBase>
                  <Tooltip title="Ir a Sistema de ACSEL Oceánica">
                    <img src={Aocea} style={{ width:60,height:50 }}/>
                  </Tooltip>
                </ButtonBase> */}
                <Button
                  size="small"
                  variant="outlined"
                  color="default"
                  // className={classes.button}
                  startIcon={<img src={Aocea} style={{ width:30,margin:5,height:30}} />}
                  style={{ fontSize:10, borderRadius:"50px"}}
                >
                 Ir ACSEL Oceánica
                </Button>
              </a>
              
            {/* </div> */}
        </div>
    )
}
