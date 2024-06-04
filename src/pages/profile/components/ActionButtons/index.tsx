import { Box, Button, ButtonGroup, Checkbox, FormControlLabel, TextField, TextareaAutosize } from "@mui/material";
import { ProfileStore } from "../../store";
import rootStore from "./../../../../store";
import { useNavigate } from "react-router-dom";
import BaseModal from "../../../../components/BaseModal";
import { Gift } from "../../../../types";
import { observer } from "mobx-react-lite";
import actionButtonsStore from "./store";

type Props = {
  userId: string;
  isVisible: boolean;
  profileStore: ProfileStore;
};

const ActionButtons = ({ userId, isVisible, profileStore }: Props) => {
  const navigate = useNavigate();

  const { authStore, modalStore, notificationStore } = rootStore;
  const { isFriend } = profileStore;
  const { draft, checkChatExist, updateMessageTextDraft, submitFirstMessage, getUserGifts, userGifts, setGift, gift, submitGift, updateGift } =
    actionButtonsStore;

  if (!isVisible) return null;

  return (
    <>
      <Box
        sx={{
          height: "48px",
          display: "flex",
          alignItems: "stretch",
          px: {
            xs: 1,
            md: 0,
          },
          gap: 1,
          boxShadow: "none",
        }}
      >
        <Button
          variant="contained"
          sx={{ width: "33.3%", fontSize: 10, borderRadius: 2 }}
          // disabled={!authStore.isAuth}
          onClick={() => {
            if (authStore.isAuth) {
              authStore.uid && userId && checkChatExist(authStore.uid, userId, (chatId) => navigate(`/chats/${chatId}`));
            } else {
              modalStore.open({ type: "AUTH_INVITATION" });
            }
          }}
        >
          Написать
        </Button>
        <Button
          variant="contained"
          sx={{ width: "33.3%", fontSize: 10, borderRadius: 2 }}
          onClick={() => {
            if (authStore.isAuth) {
              getUserGifts().then(() => {
                modalStore.open({ type: "SELECT_GIFT" });
              });
            } else {
              modalStore.open({ type: "AUTH_INVITATION" });
            }
          }}
        >
          Подарить подарок
        </Button>
        <Button
          variant="contained"
          sx={{ width: "33.3%", fontSize: 10, borderRadius: 2 }}
          color={isFriend ? "error" : "primary"}
          // disabled={!authStore.isAuth}
          onClick={() => {
            if (authStore.isAuth) {
              // сделать удаление из друзей
              if (isFriend) return;

              notificationStore
                .create(userId, {
                  userId: userId,
                  inviteUserId: String(authStore.uid),
                  type: "FRIEND",
                  status: "AWAITED",
                  isRead: false,
                })
                .then(() => {
                  console.log("success add notification");
                });

              modalStore.open({ type: "SEND_INVITE" });
            } else {
              modalStore.open({ type: "AUTH_INVITATION" });
            }
          }}
        >
          {isFriend ? "Удалить из друзей" : "Добавить в друзья"}
        </Button>
      </Box>

      <BaseModal title="Напишите сообщение" isOpen={modalStore.visible("FIRST_MESSAGE")} closeModal={() => modalStore.close()}>
        <Box textAlign="center">
          <TextField
            multiline
            rows={5}
            variant="outlined"
            sx={{ width: "100%", p: 0, mb: 2 }}
            value={draft.message}
            onChange={(e) => updateMessageTextDraft(e.target.value)}
            InputProps={{
              style: {
                padding: "6px 12px",
              },
            }}
          />
          <Button
            variant="contained"
            // disabled={!authStore.isAuth}
            onClick={() => {
              if (!authStore.uid || !userId) return;

              submitFirstMessage(authStore.uid, (chatId) => navigate(`/chats/${chatId}`));
              // store.sendMessage(authStore.uid, id);
            }}
          >
            Отправить
          </Button>
        </Box>
      </BaseModal>

      <BaseModal title="Заявка отослана" isOpen={modalStore.visible("SEND_INVITE")} closeModal={() => modalStore.close()}>
        <>
          <div style={{ fontSize: 18, marginBottom: 16, marginTop: 16 }}>Дождитесь подтверждения от пользователя</div>
          <Box textAlign="center">
            <Button variant="contained" onClick={() => modalStore.close()}>
              ОК
            </Button>
          </Box>
        </>
      </BaseModal>

      <BaseModal
        title="Выберите подарок"
        isOpen={modalStore.visible("SELECT_GIFT")}
        closeModal={() => {
          modalStore.close();
          setGift(undefined);
        }}
        sx={{
          width: {
            xs: "85vw",
            md: "30vw",
          },
          height: "auto",
        }}
      >
        {!gift ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              maxHeight: "60vh",
            }}
          >
            {userGifts?.map((gift: Gift, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    width: {
                      xs: "calc(100% /3)",
                      md: "calc(100% /3)",
                    },
                    height: 200,
                    backgroundSize: "85%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundImage: `url(${gift?.image})`,
                    position: "relative",
                    cursor: "pointer",
                    scrollbarWidth: 0,
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                  onClick={() => setGift(gift)}
                />
              );
            })}
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                width: {
                  xs: "50%",
                  md: "50%",
                },
                height: 300,
                backgroundSize: "85%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url(${gift?.image})`,
                position: "relative",
                cursor: "pointer",
                mx: "auto",
              }}
            />
            <TextareaAutosize
              maxRows={5}
              minRows={5}
              placeholder="Введите ваше сообщение"
              value={gift?.comment}
              onChange={(e) => updateGift("comment", e.target.value)}
              style={{
                backgroundColor: "#ffffffba",
                padding: "16px 32px 16px 16px",
                margin: 0,
                boxSizing: "border-box",
                outline: "none",
                width: "100%",
                borderRadius: 10,
                fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
                resize: "none",
                fontSize: 14,
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <FormControlLabel
                label="Не видим для других пользователей"
                control={<Checkbox value={gift.isVisible} onChange={(e) => updateGift("isVisible", e.target.checked)} />}
              />
              <Button
                variant="contained"
                sx={{ float: "right" }}
                onClick={() =>
                  submitGift(userId).then(() => {
                    modalStore.close();
                    profileStore.fetchProfile(userId);
                  })
                }
              >
                Подарить
              </Button>
            </Box>
          </Box>
        )}
      </BaseModal>

      <BaseModal title="" isOpen={modalStore.visible("AUTH_INVITATION")} closeModal={() => modalStore.close()}>
        <Box textAlign="center">
          <div style={{ fontSize: 18, marginBottom: 16, marginTop: 16 }}>
            Для того чтобы производить какие-либо действия на сайте вам надо авторизоваться
          </div>

          <Button
            variant="contained"
            // disabled={!authStore.isAuth}
            onClick={() => {
              navigate("/login");
            }}
          >
            Авторизоваться
          </Button>
        </Box>
      </BaseModal>
    </>
  );
};

export default observer(ActionButtons);
