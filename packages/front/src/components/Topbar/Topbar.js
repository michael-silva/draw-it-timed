import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Link as MaterialLink, AppBar, Grid, IconButton, List, ListItem, ListItemText, SwipeableDrawer, Tab, Tabs, Toolbar, Typography, FormGroup, FormControlLabel, Switch, Box } from "@mui/material";
import { makeStyles } from '@mui/styles'
import MenuIcon from "@mui/icons-material/Menu";

import logo from '../../logo.svg';
import session from "../../utils/session";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    backgroundColor: "white"
  },
  inline: {
    display: "inline"
  },
  flex: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center"
    }
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  productLogo: {
    display: "inline-block",
    borderLeft: `1px solid ${theme.palette.grey["A100"]}`,
    marginLeft: 32,
    paddingLeft: 24,
    [theme.breakpoints.up("md")]: {
      paddingTop: "1.5em"
    }
  },
  tagline: {
    display: "inline-block",
    marginLeft: 10,
    [theme.breakpoints.up("md")]: {
      paddingTop: "0.4em"
    }
  },
  iconContainer: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  iconButton: {
    float: "right"
  },
  tabContainer: {
    width: '80%',
    marginLeft: 32,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: "auto"
  }
}));

const Menu = [
    {
      label: "Home",
      pathname: "/"
    },
    {
      label: "Terms",
      pathname: "/terms"
    },
    {
      label: "Github",
      pathname: "https://github.com/michael-silva/draw-it-timed",
      external: true
    }
  
  ];

const Topbar = ({ darkMode, onChangeTheme, noTabs = false }) =>  {
    const [value, setValue] = useState(0)
    const [menuDrawer, setMenuDrawer] = useState(false)
    const classes = useStyles()
    const location = useLocation()

    const handleLogoff = () => {
      session.clearSession()
    }

  const handleChange = (event, value) => {
    setValue(value);
  };

  const mobileMenuOpen = event => {
    setMenuDrawer(true);
  };

  const mobileMenuClose = event => {
    setMenuDrawer(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const current = () => {
      const currentPath = location.pathname
    if (currentPath === "/") {
      return 0;
    }
    if (currentPath === "/terms") {
      return 1;
    }
  };


    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid container spacing={10} alignItems="baseline">
            <Grid item xs={12} className={classes.flex}>
              <div className={classes.inline}>
                <img width={40} src={logo} alt="" />
            
                <span className={classes.tagline}>
                <Typography variant="h6" color="inherit" noWrap>
                  Draw It Timed!
                  </Typography>
                </span>
              </div>
              {!noTabs && (
                <React.Fragment>
                  <div className={classes.iconContainer}>
                    <IconButton
                      onClick={mobileMenuOpen}
                      className={classes.iconButton}
                      color="inherit"
                      aria-label="Menu"
                    >
                      <MenuIcon />
                    </IconButton>
                  </div>
                  <div className={classes.tabContainer}>
                    <SwipeableDrawer
                      anchor="right"
                      open={menuDrawer}
                      onClose={mobileMenuClose}
                      onOpen={mobileMenuOpen}
                    >
                      <AppBar title="Menu" />
                      <List>
                        <ListItem>
                      <FormGroup>
                          <FormControlLabel control={<Switch color="default" checked={darkMode} onChange={onChangeTheme} />} label="Dark" />
                      </FormGroup>
                        </ListItem>
                        {Menu.map((item, index) => (
                          <ListItem
                            component={item.external ? MaterialLink : Link}
                            href={item.external ? item.pathname : null}
                            to={
                              item.external
                                ? null
                                : {
                                    pathname: item.pathname,
                                    search: location.search
                                  }
                            }
                            button
                            key={item.label}
                          >
                            <ListItemText primary={item.label} />
                          </ListItem>
                        ))}
                        <ListItem
                            button
                            onClick={handleLogoff}
                          >
                            <ListItemText primary="Log out" />
                          </ListItem>
                      </List>
                    </SwipeableDrawer>
                    <Tabs
                      value={current() || value}
                      indicatorColor="primary"
                      textColor="primary"
                      onChange={handleChange}
                    >
                      {Menu.map((item, index) => (
                        <Tab
                          key={index}
                          component={item.external ? MaterialLink : Link}
                          href={item.external ? item.pathname : null}
                          to={
                            item.external
                              ? null
                              : {
                                  pathname: item.pathname,
                                  search: location.search
                                }
                          }
                          classes={{ root: classes.tabItem }}
                          label={item.label}
                        />
                      ))}
                      <Tab
                          classes={{ root: classes.tabItem }}
                          label="Log out"
                          onClick={handleLogoff}
                        />
                      <Box ml="auto">
                      <FormGroup>
                          <FormControlLabel control={<Switch color="default" checked={darkMode} onChange={onChangeTheme} />} label="Dark" />
                      </FormGroup>
                      </Box>
                    </Tabs>
                  </div>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
}

export default Topbar;