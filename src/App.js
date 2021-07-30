import React, {useState, useContext, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import TablaSolicitudes from './components/TablaSolicitudes';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MapaView from './components/MapaView';
import AuthContext from "./Context/AuthContext/AuthContext";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LogoPira from "./logopira.svg";
import LogoOcea from "./logoocea.png";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { login,
    codUser,
    descPerf,
    userId,
    nomAuth,
    userStatus,
    estaAutenticado, } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [optMenu, setOptMenu] = useState('solicitudes');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("DATA")) {
      props.history.push('/')
    }
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
        {sessionStorage.getItem("DATA") ? (
              <>
            
             { JSON.parse(sessionStorage.getItem("DATA")).DESCPERFIL == "SUPERVISOR" ? (
                  <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              ) :
                (null)
              }

            </>
          ) : (null)}
           <AccountCircleIcon style={{marginRight:5}} size="small"  />
          <Typography variant="h7" style={{flexGrow:1}} noWrap>
            {sessionStorage.getItem("DATA") ? (
              <>
                {JSON.parse(sessionStorage.getItem("DATA")).NOMUSR}
                {"   "}
                ({JSON.parse(sessionStorage.getItem("DATA")).DESCPERFIL})
              </>
            ) : (null)}
          </Typography>
          <img src={LogoPira} style={{width:140,marginLeft:10}}/>
          <img src={LogoOcea} style={{width:140,marginLeft:10}}/>
          
          <h7 style={{ cursor: "pointer",marginLeft:20 }} onClick={() => {
            sessionStorage.clear()
            props.history.push('/')
          }} variant="h7" noWrap>
            Salir
        </h7>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Divider />
        <List>
            <ListItem button onClick={()=>setOptMenu("solicitudes")}>
              <ListItemIcon> <AddAlertIcon fontSize="small" /> </ListItemIcon>
              <ListItemText primary="Solicitudes" />
            </ListItem>
            <ListItem button onClick={()=>setOptMenu("ubicacionesSoli")}>
              <ListItemIcon> <LocationOnIcon fontSize="small" /> </ListItemIcon>
              <ListItemText primary="Solicitudes a Nivel General" />
            </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        
        {optMenu === 'solicitudes' ? (
          <TablaSolicitudes />
        ) : optMenu === 'ubicacionesSoli' ? (
          <MapaView />
        ) : (null)}

      </main>
    </div>
  );
}
