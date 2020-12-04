import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { makeStyles, Hidden } from "@material-ui/core";
import NavBar from "./NavBar";
import { AlignJustify} from "react-feather";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 256,
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
    overflowX: "hidden",
  },
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={classes.root}>
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <div style={{margin:"1rem",display:"flex",justifyContent:"space-between"}}>
            <Hidden lgUp>
              <h3>Bluesheet</h3>
              <AlignJustify onClick={() => setMobileNavOpen(true)} />
            </Hidden>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
