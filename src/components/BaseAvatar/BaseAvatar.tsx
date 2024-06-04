import * as React from "react";
import moment from "moment";

import { pluralize } from "../../utils/pluralize";
// import declensions from "../../utils/declensions";
import { Box, Button, CircularProgress, Skeleton, styled, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Crown from "../Crown";
import { setAvatarUrl } from "../../utils";
import BaseModal from "../BaseModal";
import AddIcon from "@mui/icons-material/Add";

import rootStore from "./../../store";
import Dot from "../Dot";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
dayjs.extend(utc);
dayjs.locale("ru");

const Wallpaper = styled(Box)(({ theme }) => ({
  // height: 340,
  borderRadius: 8,
  position: "relative",
  overflow: "hidden",

  backgroundSize: "cover",
  backgroundPosition: "center",
  // marginBottom: theme.spacing(2),
}));

// const Crown = styled(Box)(() => ({
//   position: "absolute",
//   top: 15,
//   right: 15,
//   // background-image: url("/crown-enable.svg");
//   backgroundImage: `url("/crown-disable.svg")`,
//   width: 30,
//   height: 30,
//   cursor: "pointer",
//   backgroundSize: "cover",
//   backgroundPosition: "center",
// }));

const UserInfo = styled(Box)(() => ({
  position: "absolute",
  zIndex: 5,
  bottom: 10,
  left: 15,
  color: "white",
}));

const IconWrapper = styled(Box)(() => ({
  position: "absolute",
  zIndex: 100,
  bottom: 10,
  right: 10,
  display: "flex",
  alignItems: "center",
  // gap: "10px",
  gap: "5px",
}));

const Photo = styled(Box)(() => ({
  cursor: "pointer",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: `url("/photo.svg")`,
  width: 25,
  height: 25,
}));

const Plus = styled(Box)(() => ({
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: `url("/plus.svg")`,
  cursor: "pointer",
  width: 20,
  height: 20,
}));

type Props = {
  isLoading: boolean;
  profileStore: any;
  isMyProfile: boolean;
  openUplodaAvatarModal: () => void;
  openGallery: () => void;
  imageCount?: number;
};

const LastVisit = styled(Box)(() => ({
  position: "absolute",
  zIndex: 100,
  top: 10,
  left: 10,
  backgroundColor: "#ffffffba",
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: 2,
}));

const BaseAvatar = ({ isLoading, profileStore, isMyProfile, openUplodaAvatarModal, openGallery, imageCount, ...props }: Props) => {
  const [isLoadVip, setIsLoadVip] = useState(false);

  const { user, galleryImages, isOpenVipModal, setIsOpenVipModal } = profileStore;

  const { authStore, subscribtionsStore, userStore } = rootStore;

  if (!user) return <></>;

  const ageCount = moment().diff(user.birthday, "years", false);
  const agePlural = pluralize({
    count: ageCount,
    one: "год",
    few: "года",
    many: "лет",
  });

  const ageLabel = `${ageCount} ${agePlural}`;
  const showImageGallery = galleryImages?.length > 0;

  const lastVisit = user?.lastVisitDate ? dayjs(user.lastVisitDate.seconds * 1000).format("MM/DD/YYYY - hh:mm") : "";

  // if (isLoading) {
  //   return (
  //     <Skeleton
  //       variant="rounded"
  //       animation="wave"
  //       width="100%"
  //       height={340}
  //       sx={{ bgcolor: 'grey.100', opacity: 0.5 }}
  //     />
  //   );
  // }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          borderRadius: {
            xs: 0,
            sm: 2,
            md: 2,
          },
          overflow: "hidden",
          flexShrink: 0,
          // paddingTop: 2,
          // marginBottom: 2,
        }}
      >
        {!isMyProfile && !user?.isOnline && lastVisit && <LastVisit>{lastVisit}</LastVisit>}

        <Wallpaper
          style={{ backgroundImage: `url(${setAvatarUrl(user)})` }}
          sx={{
            height: {
              xs: "540px",
              md: "340px",
            },
            borderRadius: {
              xs: 0,
              md: 2,
            },
          }}
        >
          <Crown
            enable={!!user?.isVip}
            onClick={() => {
              if (!isMyProfile || userStore.user.isVip) return;

              setIsOpenVipModal(true);
            }}
          />

          <UserInfo>
            <Typography component="h2">
              {user.name} {user.surname}
            </Typography>
            <Typography component="h3" sx={{ display: "flex", alignItems: "center" }}>
              {!isMyProfile && (
                <div style={{ marginRight: "8px" }}>
                  <Dot isOnline={user?.isOnline} />
                </div>
              )}
              {ageLabel}, {user.city?.label || user.city}
            </Typography>
          </UserInfo>
          <IconWrapper>
            {!!imageCount && <span style={{ color: "white", marginRight: 5 }}>{imageCount}</span>}
            {showImageGallery && <Photo onClick={openGallery} />}
            {/* {isMyProfile && <Plus onClick={openUplodaAvatarModal} />} */}
            {isMyProfile && (
              <AddIcon
                sx={{ color: "white", fontSize: 24, cursor: "pointer" }}
                // fontSize="30"
                onClick={openUplodaAvatarModal}
              />
            )}
          </IconWrapper>
        </Wallpaper>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
            background: "linear-gradient(0deg, rgba(0,0,0,0.67) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
      </Box>

      <BaseModal title="Подписка" isOpen={isOpenVipModal} closeModal={() => setIsOpenVipModal(false)}>
        <Box>
          <Box>
            <p>Купить подписку на VIP-статус:</p>
            <Button
              variant="contained"
              style={{ width: "100%", marginBottom: "15px" }}
              onClick={() => {
                setIsLoadVip(true);

                subscribtionsStore.create({ type: "VIP" }).then(async () => {
                  setIsOpenVipModal(false);

                  await userStore.updateUser({ isVip: true });
                  await profileStore.fetchProfile(authStore.uid);

                  setIsLoadVip(false);
                });
              }}
            >
              {isLoadVip ? <CircularProgress size={26} sx={{ color: "white" }} /> : <>Купить</>}
            </Button>
          </Box>
        </Box>
      </BaseModal>
    </>
  );
};

export default observer(BaseAvatar);
