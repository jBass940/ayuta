import { useEffect } from "react";
import { Box, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";

import "dayjs/locale/ru";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TelegramIcon from "@mui/icons-material/Telegram";

import { observer } from "mobx-react-lite";
import store from "./store";
import { useParams } from "react-router-dom";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Image } from "mui-image";
import DeleteIcon from "@mui/icons-material/Delete";

import BaseAppBar from "../../components/BaseAppBar";
import PageLayout from "../../components/PageLayout";

import { Comment } from "./store";

import rootStore from "../../store";
import dayjs from "dayjs";

type RouterParams = {
  userId: string;
  postId: string;
};

const PostPage = () => {
  const { userId, postId } = useParams<RouterParams>();
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { isLoading, post, commentText, setCommentText, comments, isSubmittingComment } = store;

  useEffect(() => {
    if (!userId || !postId) return;

    store.getPost(userId, postId);
    store.getComments(userId, postId);

    return () => store.clearPost();
  }, [postId, userId]);

  // const authorData = dayjs("12-25-1995").format("HH:mm DD:MM:YY");

  return (
    <PageLayout header={<BaseAppBar title="Публикация" />}>
      <ImageListItem>
        <Image src={post?.imageSrc} fit="contain" alt="" duration={300} style={{ height: downSm ? "auto" : "500px" }} showLoading />
      </ImageListItem>

      <Box
        sx={{
          background: "#ffffffba",
          px: 2,
          pb: 2,
        }}
      >
        <List sx={{ width: "100%" }}>
          {!comments.length && <Box sx={{ mt: 2, mb: 2 }}>Пока нет комментариев</Box>}

          {!!comments.length &&
            comments.map((comment: Comment, index: number) => {
              return (
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0, mx: 0 }}>
                  <ListItemAvatar>
                    <Avatar alt="" src={comment?.user?.avatar?.imageSrc} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${comment.user?.name} ${comment.user?.surname} ${dayjs(comment.createdAt).format("HH:mm DD:MM:YY")}`}
                    secondary={
                      <React.Fragment>
                        <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                          {comment.text}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <DeleteIcon sx={{ mt: 0.5, color: "#8000a9", cursor: "pointer" }} />
                </ListItem>
              );
            })}
        </List>
        <Box sx={{ position: "relative" }}>
          <TextField
            label="Ваш комментарий"
            multiline
            rows={4}
            variant="filled"
            style={{ width: "100%" }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "10px",
              // bottom: 0,
              right: "10px",
            }}
          >
            {isSubmittingComment ? (
              <Box
                sx={{
                  display: "flex",
                  // marginBottom: "10px",
                  marginBottom: 0,
                }}
              >
                <CircularProgress size={18} />
              </Box>
            ) : (
              <TelegramIcon
                sx={{ fontSize: "32px", color: "#8000a9", cursor: "pointer", display: commentText ? "block" : "none" }}
                onClick={() => {
                  console.log(userId, postId);
                  if (!rootStore.authStore.uid || !userId || !postId) return;

                  store.sendPost(rootStore.authStore.uid, userId, postId);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default observer(PostPage);
