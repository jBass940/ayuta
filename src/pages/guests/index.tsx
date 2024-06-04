import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress } from "@mui/material";
import EmptyBlock from "../../components/EmptyBlock";
import guestPageStore, { Guest } from "./store";
import { setAvatarUrl, setUserName } from "../../utils";
import rootStore from "./../../store";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import BaseAppBar from "../../components/BaseAppBar";
import PageLayout from "../../components/PageLayout";

const Guests = () => {
  const { authStore } = rootStore;
  const { isLoading, loadStatus, getGuests, guests, clearGuests } = guestPageStore;

  React.useEffect(() => {
    if (!authStore.uid) return;

    getGuests();

    return () => clearGuests();
  }, [authStore.uid, clearGuests, getGuests]);

  if (isLoading) {
    return (
      <Box sx={{ height: "100vh", width: "100%", display: "flex" }}>
        <CircularProgress size={50} sx={{ margin: "auto", color: "white" }} />
      </Box>
    );
  }

  const noGuests = !guests.length && loadStatus === "done";

  // if (noGuests) {
  //   return <EmptyBlock title="На вашей странице пока не было посетителей" />;
  // }

  return (
    <PageLayout header={<BaseAppBar title="Гости" />}>
      {noGuests ? (
        <EmptyBlock title="На вашей странице пока не было посетителей" />
      ) : (
        <List sx={{ p: 0, bgcolor: "#ffffffba" }}>
          {guests?.map((guest: Guest, key: number) => {
            const visitDate = dayjs(guest.date).format("LLLL");

            return (
              <Link key={key} to={`/profile/${guest.user.id}`} style={{ textDecoration: "none" }}>
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  <ListItemAvatar sx={{ mt: 0, ml: 0, minWidth: "auto" }}>
                    <Avatar alt="Remy Sharp" src={setAvatarUrl(guest.user)} sx={{ width: "80px", height: "80px", borderRadius: 0 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<span style={{ fontSize: "18px", color: "black" }}>{setUserName(guest.user)}</span>}
                    sx={{
                      paddingTop: 1,
                      paddingBottom: 1,
                      paddingLeft: 2,
                    }}
                    secondary={
                      <Box>
                        <Typography
                          sx={{
                            display: "inline",
                          }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Пользователь заходил <b>{visitDate}</b>
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </Link>
            );
          })}
        </List>
      )}
    </PageLayout>
  );
};

export default observer(Guests);
