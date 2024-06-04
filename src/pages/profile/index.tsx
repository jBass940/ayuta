import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IconButton, Skeleton, TextField, useMediaQuery } from "@mui/material";
import { observer } from "mobx-react-lite";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { Button, Link as MUILink, Box, styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import BaseBox from "../../components/BaseBox";
import BaseAvatar from "../../components/BaseAvatar/BaseAvatar";
import WheelOfFortune from "../../features/WheelOfFortune/WheelOfFortune";
import Status from "./components/Status";
import AddPost from "./AddPost";
import { Swiper, SwiperSlide } from "swiper/react";

import rootStore from "./../../store";

import profileStore from "./store";
import BaseModal from "../../components/BaseModal";
import { setAvatarUrl } from "../../utils";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import "swiper/css";
import BasePost from "../../components/BasePost";
import { Post } from "../../types";
import { deleteField } from "firebase/firestore";
import ActionButtons from "./components/ActionButtons";
import ScrollBlock from "./components/ScrollBlock";
import LoadingBlock from "../../components/LoadingBlock";

import { useTheme } from "@mui/material/styles";
import PageLayout from "../../components/PageLayout";

const Slide = styled(Box)(() => ({
  width: 120,
  height: 120,
  flexShrink: 0,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  cursor: "pointer",
  // marginRight: "15px",
  // marginRight: '24px',
  // borderRadius: "50%",
}));

type RouterParams = {
  id: string;
};

const Profile = () => {
  const { id } = useParams<RouterParams>();
  const { authStore, userStore, modalStore } = rootStore;

  const { user, fetchProfile, saveAvatar, updateAvatar, deleteAvatar, clearUser, addVisit } = profileStore;

  // const matches = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [isAvatarUpload, setIsAvatarUpload] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    modalStore.close();
  };

  useEffect(() => {
    if (!id) return;

    // если мой профиль то закачиваем только один раз

    fetchProfile(id);

    return () => clearUser();
  }, [clearUser, fetchProfile, id]);

  const isMyProfile = authStore.uid === id;

  const handleChangeImage = (e: any) => {
    profileStore.setAvatarPreview(e.target.files[0]);
  };

  const closeGalleryHandler = () => {
    profileStore.setIsOpenGallery(false);
    profileStore.setActiveSlideIndex(0);
    modalStore.close();
  };

  useEffect(() => {
    // принудительное скрытие галереи при загрузке страницы
    profileStore.setIsOpenGallery(false);
    modalStore.close();
  }, [modalStore]);

  useEffect(() => {
    if (!userStore?.user?.id) return;
    if (!profileStore?.user?.id) return;
    if (isMyProfile) return;
    if (userStore?.user?.invisible) return;

    addVisit(String(user.id));
  }, [userStore?.user?.invisible, userStore?.user?.id, addVisit, isMyProfile, user?.id]);

  useEffect(() => {
    // @ts-ignore
    window.yaContextCb.push(() => {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      Ya.Context.AdvManager.render({
        blockId: "R-A-3916346-1",
        type: "fullscreen",
        platform: "touch",
      });
    });
  }, []);

  if (profileStore.isLoadUser) return <LoadingBlock />;

  return (
    <PageLayout header={undefined}>
      <Box>
        <Grid
          container
          spacing={0}
          wrap={downMd ? "wrap" : "nowrap"}
          sx={{
            gap: {
              xs: 1,
              sm: 2,
            },
            px: {
              sm: 2,
            },
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: {
                xs: 1,
                sm: 2,
              },
              pt: {
                sm: 2,
              },
              pb: {
                sm: 2,
              },
              // height: {
              //   sm: "calc(100vh - 100px)",
              // },
              scrollbarWidth: 0,
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <BaseAvatar
              isLoading={profileStore.isLoadUser}
              profileStore={profileStore}
              isMyProfile={isMyProfile}
              openUplodaAvatarModal={() => modalStore.open({ type: "SET_AVATAR" })}
              openGallery={() => modalStore.open({ type: "GALLERY" })}
              imageCount={profileStore.galleryImages?.length}
            />

            <ActionButtons userId={String(id)} isVisible={!profileStore.isLoadUser && !isMyProfile} profileStore={profileStore} />

            <Status
              isLoading={profileStore.isLoadUser}
              isShow={!isMyProfile && !profileStore.isLoadUser}
              status={profileStore.user?.status}
              isDisabled={!isMyProfile}
              onSave={(newStatus) => userStore.updateUser({ status: newStatus })}
              onSuccessSave={() => {
                modalStore.open({
                  type: "SUCCESS_SET_STATUS",
                  title: "Статус успешно обновлён",
                });
                id && profileStore.fetchProfile(id);
              }}
            />

            <WheelOfFortune isShow={isMyProfile} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={8}
            sx={{
              // height: {
              //   // sm: "100vh",
              // },
              display: "flex",
              flexDirection: "column",
              gap: {
                xs: 1,
                sm: 2,
              },
              // overflowY: "auto",
              // overflowY: {
              //   xs: "inherit",
              //   sm: "auto",
              // },
              scrollbarWidth: 0,
              "&::-webkit-scrollbar": {
                display: "none",
              },
              py: { sm: 2 },
            }}
          >
            <Status
              isLoading={profileStore.isLoadUser}
              isShow={isMyProfile}
              status={profileStore.user?.status}
              isDisabled={!isMyProfile}
              onSave={(newStatus) => userStore.updateUser({ status: newStatus })}
              onSuccessSave={() => {
                modalStore.open({
                  type: "SUCCESS_SET_STATUS",
                  title: "Статус успешно обновлён",
                });
                id && profileStore.fetchProfile(id);
              }}
            />

            <ScrollBlock
              type="FRIENDS"
              isLoading={profileStore.isLoadUser}
              header="Друзья"
              allLink={`/friends/all/${id}`}
              data={profileStore.friends}
            />

            <ScrollBlock type="GIFTS" isLoading={profileStore.isLoadUser} header="Подарки" allLink={`/gifts/all/${id}`} data={profileStore.gifts} />

            {!profileStore.isLoadUser && profileStore.posts.length ? (
              // <Box sx={{ pb: { xs: '60px', md: 0 } }}>
              <Box sx={{ pb: { xs: "0px", sm: 0 } }}>
                {profileStore.posts.map((post: Post, index: any) => (
                  <Box key={index} sx={{ pb: { xs: 1, sm: 2 } }}>
                    <BasePost key={index} userId={id} post={post} />
                  </Box>
                ))}
              </Box>
            ) : null}

            {!profileStore.isLoadUser && isMyProfile && !profileStore.posts.length && <AddPost />}
            {!profileStore.isLoadUser && !isMyProfile && !profileStore.posts.length && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 80,
                  backgroundColor: "#ffffffba",
                  borderRadius: 2,
                  // marginTop: 2,
                  mx: {
                    xs: 1,
                    sm: 0,
                  },
                }}
              >
                У пользователя пока нет публикаций
              </Box>
            )}

            {/* {profileStore.isLoadUser && (
              <Skeleton
                variant="rounded"
                animation="wave"
                width="100%"
                height={340}
                sx={{ bgcolor: 'grey.100', opacity: 0.5 }}
              />
            )} */}
          </Grid>
        </Grid>

        <BaseModal
          title="Установить фото"
          isOpen={modalStore.visible("SET_AVATAR")}
          closeModal={() => {
            modalStore.close();
            profileStore.clearAvatarPreview();
          }}
        >
          <>
            <Box
              sx={{
                width: "100%",
                height: "400px",
                borderRadius: "8px",
                display: "flex",
                position: "relative",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${
                  // store.avatarPreviewLocalUrl || "/avatarMale.svg"
                  profileStore.avatarPreviewLocalUrl || setAvatarUrl(userStore.user)
                })`,
                backgroundPositioX: "center",
                backgroundPositioY: "center",
                WebkitBackgroundSize: "cover",
                mb: {
                  xs: 2,
                  md: 3,
                },
              }}
            />

            {!profileStore.avatarPreview && (
              <Button variant="outlined" fullWidth component="label">
                Сменить аватар
                <input type="file" accept="image/*" hidden onChange={handleChangeImage} />
              </Button>
            )}
            {profileStore.avatarPreview && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setIsAvatarUpload(true);
                  saveAvatar(String(id)).then(() => {
                    setIsAvatarUpload(false);
                  });
                }}
              >
                {isAvatarUpload ? <CircularProgress size={26} sx={{ color: "white" }} /> : "Сохранить"}
              </Button>
            )}
          </>
        </BaseModal>

        <BaseModal
          title="Купить колесо"
          isOpen={profileStore.isOpenWheelPayDataModal}
          closeModal={() => profileStore.setIsOpenWheelPayDataModal(false)}
        >
          <>
            <Typography sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus illum doloribus placeat, sit autem, obcaecati veniam dicta deleniti
              laudantium itaque adipisci consequatur molestiae nemo? Error sit aliquam obcaecati sunt dolores dolorum, cupiditate quisquam quod culpa
              aut eaque corporis, qui nihil?
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Button variant="contained" onClick={() => profileStore.setIsOpenWheelPayDataModal(false)}>
                100
              </Button>
              <Button variant="contained" onClick={() => profileStore.setIsOpenWheelPayDataModal(false)}>
                200
              </Button>
              <Button variant="contained" onClick={() => profileStore.setIsOpenWheelPayDataModal(false)}>
                300
              </Button>
            </Box>
          </>
        </BaseModal>

        <Dialog
          fullScreen
          open={modalStore.visible("GALLERY")}
          onClose={() => modalStore.close()}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title" sx={{ p: 0, m: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                m: 1,
                p: 0,
              }}
            >
              <div>
                <Box
                  id="basic-button"
                  // onClick={() => store.toggleDropdownVisible()}
                  onClick={handleClick}
                  sx={{
                    width: "30px",
                    m: 0,
                    p: 0,
                    display: "flex",
                    alignItems: " center",
                    marginRight: 2,
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <MoreVertIcon />
                </Box>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={() => updateAvatar(String(id), handleClose)}>Установить аватарку</MenuItem>
                  <MenuItem onClick={() => deleteAvatar(String(id), handleClose, deleteField)}>Удалить из галлереи</MenuItem>
                </Menu>
              </div>

              <IconButton edge="start" color="inherit" onClick={closeGalleryHandler} aria-label="close" sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers={profileStore.isOpenGallery}>
            <DialogContentText
              id="scroll-dialog-description"
              // ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                onSlideChange={(slide) => profileStore.setActiveSlideIndex(slide.activeIndex)}
                onSwiper={(swiper) => console.log(swiper)}
                // height="auto"
                wrapperClass="auto-height"
                setWrapperSize={true}
              >
                {profileStore.galleryImages.map((slide, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Box
                        sx={{
                          backgroundImage: `url(${slide.imageSrc})`,
                          backgroundPosition: "center",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          width: "100%",
                          height: "100%",
                        }}
                      ></Box>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
            <div
              style={{ textDecoration: "none", display: "flex" }}
              onClick={() => {
                navigate(`/post/${id}/${profileStore.galleryImages[profileStore.activeSlideIndex]?.postId}`);
                profileStore.setIsOpenGallery(false);
              }}
            >
              <img src="/icon-comment.svg" alt="icon-comment" />
            </div>
            <Typography sx={{ color: "white" }}>
              {profileStore.activeSlideIndex + 1} из {profileStore.galleryImages.length}
            </Typography>
          </DialogActions>
        </Dialog>

        <BaseModal
          title={profileStore.successModal.text}
          isOpen={profileStore.successModal.isOpen}
          closeModal={() => profileStore.updateSuccessModal({ isOpen: false, text: "" })}
        >
          <Box textAlign="center">
            <Button variant="contained" onClick={() => profileStore.updateSuccessModal({ isOpen: false, text: "" })}>
              OK
            </Button>
          </Box>
        </BaseModal>
      </Box>

      {!!profileStore.posts.length && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: {
              xs: "70px",
              md: "20px",
            },
            right: "20px",
          }}
          onClick={() => navigate("/add_post")}
        >
          <AddIcon />
        </Fab>
      )}
    </PageLayout>
  );
};

export default observer(Profile);
