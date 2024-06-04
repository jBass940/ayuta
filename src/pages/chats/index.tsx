import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import EmptyBlock from "../../components/EmptyBlock";
import store from "../../store";
import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import chatPageStore from "./store";
import { getOpponentId, setAvatarUrl } from "../../utils";
import BaseAppBar from "../../components/BaseAppBar";
import PageLayout from "../../components/PageLayout";

const Chats = () => {
  const navigate = useNavigate();

  const { authStore, notificationStore } = store;

  const notifications = notificationStore.notifications.map((n) => n.chatId);

  const { listen, chats, close, users } = chatPageStore;

  React.useEffect(() => {
    authStore.uid && listen();

    return () => close();
  }, [authStore.uid, listen, close]);

  const showUnread = (chatId: string) => {
    const num = notifications?.filter((n) => n === chatId)?.length;

    return !num ? null : (
      <Box
        sx={{
          marginLeft: 2,
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
        {num}
      </Box>
    );
  };

  const hasChats = Object.keys(chats).length;

  return (
    <PageLayout header={hasChats ? <BaseAppBar title="Чаты" /> : null}>
      {Object.keys(chats).length ? (
        <>
          <List>
            {Object.entries(chats).map(([key, chat]) => {
              const opponent = users[getOpponentId(String(chat?.id), String(authStore.uid))];
              const opponentName = `${opponent?.name} ${opponent?.surname}`;

              return (
                <div key={key} style={{ position: "relative" }}>
                  <ListItem
                    secondaryAction={<Box sx={{ fontSize: 24 }}>{dayjs(chat.lastMessageDate.seconds * 1000).format("HH:mm")}</Box>}
                    alignItems="center"
                    sx={{ cursor: "pointer", position: "relative" }}
                    onClick={() => navigate(`/chats/${chat?.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar alt={chat.userA} src={setAvatarUrl(opponent)} sx={{ width: 48, height: 48 }} />
                    </ListItemAvatar>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        backgroundColor: opponent?.isOnline ? "green" : "gray",
                        borderRadius: "50%",
                        position: "absolute",
                        top: 50,
                        left: 48,
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="body1"
                          sx={{
                            display: "flex",
                            fontSize: "17px",
                            fontWeight: 600,
                          }}
                        >
                          {opponentName} {showUnread(String(chat?.id))}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography noWrap>{chat.lastMessageText}</Typography>
                        </React.Fragment>
                      }
                      sx={{ paddingLeft: 1 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                </div>
              );
            })}
          </List>
        </>
      ) : (
        <EmptyBlock title="У вас пока нет ни одного чата. Найдите друга на странице Поиска" btnText="Искать" link="/search" />
      )}
    </PageLayout>
  );
};

export default observer(Chats);
