import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme, alpha } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import ImageIcon from "@material-ui/icons/Image";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { getUsers, getToken, logoutSuccess } from "../features/user/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import alertify from "alertifyjs";
import "./Navigation.css";
import "./Toggle.css";
import Theme from "./Theme";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const userExist = useSelector(getUsers);
  const dispatch = useDispatch();
  const token = useSelector(getToken);

  const handleLogout = (e) => {
    alertify.success("Logged Out!");
    dispatch(logoutSuccess());
    history.push("/");
    e.preventDefault();
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            G-Ward
          </Typography>
          <div style={{ display: "block", marginLeft: "auto" }}>
            <Theme />
          </div>
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
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={0}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <Link to="/" className="link">
              <ListItemText primary={"Home"} />
            </Link>
          </ListItem>
          {userExist ? (
            <ListItem button key={9}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Link to={`/Dashboard/${token}`} className="link">
                <ListItemText primary={"Dashboard"} />
              </Link>
            </ListItem>
          ) : null}

          {userExist ? null : (
            <ListItem button key={1}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <Link to="/login" className="link">
                <ListItemText primary={"Login"} />
              </Link>
            </ListItem>
          )}
          {userExist ? null : (
            <ListItem button key={2}>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <Link to="/signup" className="link">
                <ListItemText primary={"Signup"} />
              </Link>
            </ListItem>
          )}
          {userExist ? (
            <ListItem button key={3}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <Link to={`/profile/${token}`} className="link">
                <ListItemText primary={"Profile"} />
              </Link>
            </ListItem>
          ) : null}

          {userExist ? (
            <ListItem button key={7}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <Link to={`/Image/${token}`} className="link">
                <ListItemText primary={"Image"} />
              </Link>
            </ListItem>
          ) : null}

          {userExist ? (
            <ListItem button key={12}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <Link to={`/History/${token}`} className="link">
                <ListItemText primary={"History"} />
              </Link>
            </ListItem>
          ) : null}

          {userExist ? (
            <ListItem button key={10}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>

              <Link to={`/ChangePassword/${token}`} className="link">
                <ListItemText primary={"Change Password"} />
              </Link>
            </ListItem>
          ) : null}
          {userExist ? (
            <ListItem button key={4}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>

              <ListItemText primary={"Logout"} onClick={handleLogout} />
            </ListItem>
          ) : null}
        </List>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}
