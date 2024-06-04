import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { observer } from "mobx-react-lite";
import BaseDrawer from "../BaseDrawer/BaseDrawer";
import rootStore from "./../../store";
// import { wallpaperImage= } from '../../const';
import BaseModal from "../BaseModal";
import { Button } from "@mui/material";
import BaseNavigation from "../BaseNavigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { wallpaperSrc } from "../../const";
import BaseAppBar from "../BaseAppBar";
import { useTheme } from "@mui/material/styles";

type Anchor = "top" | "left" | "bottom" | "right";

const BaseLayout = (): React.ReactElement => {
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:600px)");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [user, loading] = useAuthState(getAuth());

  const { authStore, userStore, notificationStore, modalStore, subscribtionsStore } = rootStore;

  const [state, setState] = useState({
    left: false,
  });

  const [windowWidth, setWindowWidth] = useState(0);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <div onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <BaseDrawer />
    </div>
  );

  // useEffect(() => {
  //   userStore.fetchUser();
  //   subscribtionsStore.getAllSubscriptions();
  // }, [subscribtionsStore, userStore]);

  useLayoutEffect(() => {
    setWindowWidth(window.screen.width);

    function setVal(e: any) {
      setWindowWidth(e.currentTarget.outerWidth);
    }

    window.addEventListener("resize", setVal);

    return () => window.removeEventListener("resize", setVal);
  }, []);

  useEffect(() => {
    const userId = authStore.uid;

    if (!userId) return;

    notificationStore.subscribe(userId);
  }, [authStore.uid, notificationStore]);

  const Drawer = () => {
    return (
      <div style={{ overflowY: "hidden" }}>
        <React.Fragment key={"left"}>
          {/* @ts-ignore */}
          <SwipeableDrawer
            disableSwipeToOpen={windowWidth > 1199}
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
            // style={{ overflow: "auto" }}
            style={{ overflowY: "hidden" }}
          >
            {list("left")}
          </SwipeableDrawer>
        </React.Fragment>
      </div>
    );
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${userStore?.user?.wallpaper?.imageSrc || wallpaperSrc})`,
          // backgroundColor: {
          //   xs: "white",
          //   sm: "yellow",
          //   md: "orange",
          //   lg: "brown",
          //   xl: "red",
          // },
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Container
          maxWidth="lg"
          disableGutters={isMobile}
          sx={{
            p: 0,
          }}
        >
          <Grid container spacing={0} gap={0} wrap="nowrap">
            <Grid item style={{ width: 240 }} display={{ xs: "none", lg: "block" }}>
              <BaseDrawer />
            </Grid>
            <Grid
              item
              sm={12}
              md={12}
              sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                width: matches ? "100%" : `calc(100% - 240px)`,
                backgroundColor: "#ffffff40",
                position: "relative",
              }}
            >
              <Outlet />
            </Grid>
          </Grid>
        </Container>

        <Drawer />
      </Box>

      <BaseModal title={String(modalStore?.title)} isOpen={modalStore.baseType} closeModal={modalStore.close}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={modalStore.close}>
            OK
          </Button>
        </Box>
      </BaseModal>
    </>
  );
};

export default observer(BaseLayout);
