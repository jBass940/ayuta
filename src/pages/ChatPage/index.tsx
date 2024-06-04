import * as React from "react";
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, TextField, Typography, styled } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import chatPageStore from "./store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import rootStore from "./../../store";
import { setAvatarUrl } from "../../utils";

export const TextFieldWrapper = styled(TextField)`
  fieldset {
    border-radius: 16px;
  }
`;

type RouterParams = {
  chatId: string;
};

const ChatPage = () => {
  const { chatId } = useParams<RouterParams>();
  const navigate = useNavigate();

  const { authStore, notificationStore } = rootStore;

  const { init, removeListener, watchIsOnlineUser, removeOnlineListener, companion, messages, messageText, updateMessageText, sendMessage } =
    chatPageStore;

  React.useEffect(() => {
    if (!chatId || !authStore.uid) return;

    init(chatId, authStore.uid);
    watchIsOnlineUser(chatId);

    notificationStore.readNotifications(authStore.uid, "CHAT");

    return () => {
      removeListener();
      removeOnlineListener();
    };
  }, [authStore.uid, chatId, init, notificationStore, removeListener, removeOnlineListener, watchIsOnlineUser]);

  const setAvatar = () => {
    if (!companion) return "";

    return setAvatarUrl(companion);
  };

  const setUserName = () => {
    if (!companion) return "...";

    return `${companion?.name} ${companion?.surname}`;
  };

  const isOnline = companion && companion?.isOnline;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#8000a9",
          height: 72,
        }}
      >
        <KeyboardArrowLeftIcon sx={{ color: "white", fontSize: "34px", cursor: "pointer" }} onClick={() => navigate("/chats")} />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              // alt={userName}
              src={setAvatar()}
            />
          </ListItemAvatar>
          <ListItemText
            primary={setUserName()}
            sx={{ color: "white" }}
            secondary={
              <React.Fragment>
                <Typography sx={{ display: "inline", color: "gray" }} component="span" variant="body2" color="text.primary">
                  {isOnline ? <span style={{ color: "green", fontWeight: 600 }}>В сети</span> : <span>Не в сети</span>}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          padding: "16px 24px",
          height: {
            xs: "calc( 100vh - 123px - 60px )",
            sm: "calc( 100vh - 72px - 52px )",
          },
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {messages.map((message, index) => {
          const isMyMessage = message?.userId === authStore?.uid;

          return (
            <>
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isMyMessage ? "flex-end" : "flex-start",
                  marginBottom: 2,
                }}
              >
                <Box sx={{ position: "relative", zIndex: 10 }}>
                  <Box
                    sx={{
                      backgroundColor: isMyMessage ? "white" : "#8000a9",
                      color: isMyMessage ? "black" : "white",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    <Box>{message?.text}</Box>
                    {/* <Box>{message?.createdAt}</Box> */}
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                      bottom: 0,
                      left: isMyMessage ? "" : "-10px",
                      right: isMyMessage ? "-10px" : "",
                      width: 0,
                      height: 0,
                      borderLeft: "15px solid transparent",
                      borderRight: "15px solid transparent",
                      borderBottom: `15px solid ${isMyMessage ? "white" : "#8000a9"}`,
                    }}
                  />
                </Box>
              </Box>
            </>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ width: "100%", padding: 1, flexGrow: 1 }}>
          <TextFieldWrapper
            multiline
            variant="outlined"
            sx={{ width: "100%", p: 0 }}
            value={messageText}
            onChange={(e) => updateMessageText(e.target.value)}
            InputProps={{
              style: {
                padding: "6px 12px",
              },
            }}
          />
        </Box>
        <Box>
          <SendIcon
            sx={{ color: "#8000a9", padding: "10px 12px 10px 4px" }}
            onClick={() => chatId && authStore.uid && sendMessage(chatId, authStore.uid)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default observer(ChatPage);
