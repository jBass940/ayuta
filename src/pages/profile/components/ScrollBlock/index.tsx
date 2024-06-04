import { observer } from "mobx-react-lite";
import { Button, Typography, styled } from "@mui/material";
import { Box } from "@mui/material";
import { User } from "../../../../api/user";
import { Gift } from "../../../../types";
import { Link, useNavigate } from "react-router-dom";
import { initialFriends, initialGifts } from "../../../../const";
import BaseModal from "../../../../components/BaseModal";
import rootStore from "../../../../store";
import { useState } from "react";
import Api from "../../../../api";
import { setAvatarUrl } from "../../../../utils";

const Content = styled(Box)(() => ({
  // width: "auto",
  // maxWidth: "100%",
  margin: "10px 0 0 0",
  // overflow: "hidden",
}));

const Slide = styled(Box)(() => ({
  width: 120,
  height: 120,
  flexShrink: 0,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  cursor: "pointer",
}));

export type ScrollBlockType = "FRIENDS" | "GIFTS";

export type ScrollBlockItem = User | Gift;

type Props = {
  type: ScrollBlockType;
  isLoading: boolean;
  header: string;
  allLink: string;
  data: ScrollBlockItem[];
};

function ScrollBlock({ type, isLoading, header, allLink, data }: Props) {
  const navigate = useNavigate();

  const [selectedGift, setSelectedGift] = useState<Gift | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const { modalStore } = rootStore;

  const isFriendType = type === "FRIENDS";
  const noData = !data?.length;
  const userFio = `${selectedUser?.name} ${selectedUser?.surname}`;

  const calcData = () => {
    if (noData) {
      return isFriendType ? initialFriends : initialGifts;
    }

    return data;
  };

  const disableBorderRadius = !noData && !isFriendType;

  return (
    <>
      <Box
        sx={{
          width: "auto",
          py: 2,
          px: { xs: 0, md: 2 },
          borderRadius: {
            sx: 0,
            sm: 2,
          },
          backgroundColor: "#ffffffba",
        }}
      >
        <Box
          sx={{
            width: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", pl: { xs: 2, md: 0 } }}>{header}</Typography>

          {noData ? null : (
            <Box sx={{ pr: { xs: 2, md: 0 } }}>
              <Link
                to={allLink}
                style={{
                  fontSize: "14px",
                  textDecoration: "none",
                  color: "black",
                }}
              >
                посмотреть все
              </Link>
            </Box>
          )}
        </Box>

        <Content>
          <Box
            sx={{
              // display: "flex",
              // justifyContent: "space-between",
              // alignContent: "center",
              overflowX: "scroll",
            }}
          >
            <Box
              sx={{
                // flex: 1,
                width: "max-content",
              }}
            >
              {calcData()?.map((item: ScrollBlockItem, index: any) => {
                const image = isFriendType ? setAvatarUrl(item as User) : (item as Gift)?.image;

                const isOnline = isFriendType ? (item as User)?.isOnline : false;

                return (
                  <Slide
                    key={index}
                    style={{
                      display: "inline-block",
                      backgroundImage: `url(${image})`,
                      // borderRadius: isFriendType ? '50%' : 0,
                      borderRadius: disableBorderRadius ? 0 : "50%",
                      opacity: noData ? 0.5 : 1,
                      position: "relative",
                    }}
                    sx={{ ml: { xs: 2, md: 0 }, mr: { xs: 0, md: 2 } }}
                    onClick={async () => {
                      if (isFriendType) {
                        if (!item.id) return;
                        navigate(`/profile/${item.id}`);
                      } else {
                        if (noData) return;

                        const donatorId = (item as Gift).donatorId;
                        const user = await Api.user.get(donatorId);

                        setSelectedGift(item as Gift);
                        setSelectedUser(user as User);

                        modalStore.open({ type: "SHOW_RECEIVED_GIFT" });
                      }
                    }}
                  >
                    {isFriendType && item?.id && (
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: isOnline ? "#45b344" : "gray",
                          position: "absolute",
                          bottom: 5,
                          right: 10,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: 14,
                        }}
                      />
                    )}
                  </Slide>
                );
              })}
            </Box>
          </Box>
        </Content>
      </Box>

      <BaseModal
        title="Подарок"
        isOpen={modalStore.visible("SHOW_RECEIVED_GIFT")}
        closeModal={() => {
          modalStore.close();
          setSelectedGift(undefined);
          setSelectedUser(undefined);
        }}
      >
        <Box>
          <Typography variant="body1">от {userFio}</Typography>
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
              backgroundImage: `url(${selectedGift?.image})`,
              position: "relative",
              cursor: "pointer",
              mx: "auto",
            }}
          />
          <Typography>{selectedGift?.comment}</Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                modalStore.close();
                setSelectedGift(undefined);
              }}
            >
              Ок
            </Button>
          </Box>
        </Box>
      </BaseModal>
    </>
  );
}

export default observer(ScrollBlock);
