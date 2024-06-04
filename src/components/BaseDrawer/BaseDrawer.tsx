import * as React from "react";
import { menu, MenuItem } from "../../mock/menu";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Avatar, Box, CircularProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import store from "./../../store";
import { ListItem } from "@mui/material";
import { setAvatarUrl } from "../../utils";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const subscriptionLabelMap = {
  WHEEL: { title: "Колесо фортуны", icon: "icon_wheel" },
  VIP: { title: "VIP-статус", icon: "crown-disable" },
};

const hideOnMobile = ["Гости", "Поиск", "Сообщения", "Магазин"];

const BaseDrawer = (): React.ReactElement => {
  const navigate = useNavigate();

  const {
    authStore: { isAuth, uid, logOut },
    userStore,
    notificationStore,
    subscribtionsStore,
  } = store;
  const { isLoadUser, user } = userStore;
  const { unreadFriendInviteNotifications, unreadChatNotifications } = notificationStore;
  const { subscriptions } = subscribtionsStore;

  return (
    <List
      sx={{
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        maxWidth: 360,
        bgcolor: "#8000a9",
        pt: 0,
        // overflow: 'hidden',
      }}
    >
      <ListItemButton alignItems="center" component={Link} to="/">
        <ListItemIcon>
          <Box
            sx={{
              width: "32px",
              height: "32px",
              // marginLeft: "5px",
              // marginRight: "2px",
              // color: "white",
              backgroundImage: `url(/logo_white.svg)`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </ListItemIcon>

        <ListItemText
          primary="Ayuta"
          sx={{ color: "white" }}
          secondary={
            <React.Fragment>
              <Typography sx={{ display: "inline" }} component="span" variant="body2" color="#ffffffba">
                социальная сеть
              </Typography>
            </React.Fragment>
          }
        />
      </ListItemButton>

      <Divider component="li" />

      <ListItemButton alignItems="flex-start" onClick={() => navigate(`/profile/${uid}`)} sx={{ display: isAuth ? "flex" : "none" }}>
        <ListItemAvatar>
          <Avatar alt={user?.name} src={setAvatarUrl(user)} />
        </ListItemAvatar>
        <ListItemText
          primary={user?.name}
          sx={{ color: "white", textDecoration: "none" }}
          secondary={
            <React.Fragment>
              <Typography
                sx={{
                  display: "inline",
                  color: "white",
                  textDecoration: "none",
                }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {user?.surname}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItemButton>

      <Divider component="li" />

      {menu.map((item: MenuItem, key: number) => {
        if (item?.protected && !isAuth) return null;

        return (
          <ListItem
            button
            key={key}
            component={Link}
            to={item.link}
            hidden={true}
            sx={{
              display: {
                xs: hideOnMobile.includes(item.label) ? "none" : "flex",
                md: "flex",
              },
            }}
          >
            <Box
              sx={{
                width: "25px",
                height: "25px",
                marginLeft: "5px",
                marginRight: "20px",
                color: "white",
                backgroundImage: `url(/${item.icon}.svg)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <ListItemText sx={{ display: "flex" }}>
              <Typography
                sx={{
                  display: "flex",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 200,
                  ml: 1,
                }}
              >
                {item.label}
                {/* {item.icon === "chat" && unreadCountTotal > 0 && ( */}
                {item.icon === "chat" && unreadChatNotifications > 0 && (
                  <Box
                    sx={{
                      marginLeft: 3,
                      backgroundColor: "white",
                      color: "black",
                      borderRadius: "50%",
                      padding: "2px",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {unreadChatNotifications}
                  </Box>
                )}

                {item.icon === "bell" && unreadFriendInviteNotifications > 0 && (
                  <Box
                    sx={{
                      marginLeft: 3,
                      backgroundColor: "white",
                      color: "black",
                      borderRadius: "50%",
                      padding: "2px",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {unreadFriendInviteNotifications}
                  </Box>
                )}
              </Typography>
            </ListItemText>
          </ListItem>
        );
      })}

      <Divider />

      {isAuth &&
        subscriptions.map(({ createdAt, type, month }, index: number) => {
          const isWheel = type === "WHEEL";
          const subscriptionDate = dayjs(createdAt)
            .add(isWheel ? Number(month) : 14, isWheel ? "months" : "days")
            .format("DD/MM/YYYY");

          // console.log("subscriptions >>> ", subscriptions);

          return (
            <ListItemButton key={index} alignItems="center">
              <ListItemIcon>
                <Box
                  sx={{
                    width: "42px",
                    height: "42px",
                    backgroundImage: `url(/${subscriptionLabelMap[type].icon}.svg)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </ListItemIcon>
              <ListItemText sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  {subscriptionLabelMap[type].title}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  {/* активно до {subscriptionDate} */}
                  до {subscriptionDate}
                </Typography>
              </ListItemText>
            </ListItemButton>
          );
        })}

      <ListItemButton
        onClick={() => {
          isAuth ? logOut() : navigate(`/login`);
        }}
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: 14,
            fontWeight: 100,
          }}
        >
          {isAuth ? "Выйти" : "Войти"}
        </Typography>
      </ListItemButton>
    </List>
  );
};

export default observer(BaseDrawer);
