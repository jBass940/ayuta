import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { Box, Button } from "@mui/material";
import rootStore from "./../../store";
import { Notification } from "./../../store/notificationStore";
import EmptyBlock from "../../components/EmptyBlock";
import { arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import BaseAppBar from "../../components/BaseAppBar";
import PageLayout from "../../components/PageLayout";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const { authStore, userStore, notificationStore } = rootStore;
  const { inviteNotifications } = notificationStore;

  React.useEffect(() => {
    notificationStore.combineInviteNotifications();
  }, [notificationStore]);

  React.useEffect(() => {
    const userId = authStore.uid;

    if (!userId) return;
    if (!notificationStore.isSubscribe) return;

    notificationStore.readNotifications(userId, "FRIEND");
  }, [authStore.uid, notificationStore, notificationStore.isSubscribe]);

  // if (!inviteNotifications?.length) {
  //   return <EmptyBlock title="У вас пока нет уведомлений" />;
  // }

  const isActionBtnVisible = (status: Notification["status"]) => status === "AWAITED";

  const inviteLabel = (status: Notification["status"]) => {
    switch (status) {
      case "AWAITED":
        return "Хочет добавить вас в друзья";
      case "ACCEPTED":
        return "Добавлен в друзья";
      case "REJECTED":
        return "Заявка отклонена";
    }
  };

  return (
    <PageLayout header={<BaseAppBar title="Уведомление" />}>
      <List>
        {!inviteNotifications?.length ? (
          <EmptyBlock title="У вас пока нет уведомлений" />
        ) : (
          inviteNotifications.map((invite: Notification, key: number) => {
            return (
              <div key={key}>
                <ListItem
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                  secondaryAction={
                    <>
                      {isActionBtnVisible(invite.status) && (
                        <>
                          <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            sx={{ mr: 2 }}
                            onClick={() => {
                              console.log(">>> ", String(authStore.uid), invite.uid);

                              // return;

                              notificationStore.updateNotification(String(authStore.uid), invite.uid, {
                                status: "REJECTED",
                              });
                            }}
                          >
                            Отклонить
                          </Button>
                          <Button
                            variant="contained"
                            size="large"
                            onClick={() => {
                              console.log(">>> ", String(authStore.uid), invite.uid);

                              // return;

                              notificationStore.updateNotification(String(authStore.uid), invite.uid, {
                                status: "ACCEPTED",
                              });

                              userStore.updateUser({
                                friends: arrayUnion(invite.inviteUserId),
                              });

                              userStore.updateUser(
                                {
                                  friends: arrayUnion(invite.userId),
                                },
                                invite.inviteUserId
                              );
                            }}
                          >
                            Принять
                          </Button>
                        </>
                      )}
                    </>
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => navigate(`/profile/${invite.inviteUserId}`)}>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={invite.avatar} sx={{ width: 48, height: 48 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography component="span" variant="body1" sx={{ fontSize: "17px", fontWeight: 600 }}>
                          {invite.userName}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography noWrap>{inviteLabel(invite.status)}</Typography>
                        </React.Fragment>
                      }
                      sx={{ paddingLeft: 1 }}
                    />
                  </Box>
                </ListItem>
                <Divider component="li" />
              </div>
            );
          })
        )}
      </List>
    </PageLayout>
  );
};

export default observer(NotificationsPage);
