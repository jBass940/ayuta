import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import rootStore from "./../../store";
import { useEffect } from "react";
import { Gift } from "../../types";
import BaseModal from "./../../components/BaseModal";
import { Button } from "@mui/material";
import shopStore from "./store";
import { observer } from "mobx-react-lite";
import PageLayout from "../../components/PageLayout";

const categoryToColor: Record<string, string> = {
  blue1: "#52b0e3",
  blue2: "#9575fc",
  blue3: "#0060ff",
  blue4: "#1094e5",
  green1: "#45b344",
  green2: "#65e19c",
  red1: "red",
  red2: "#c7539b",
  red3: "#d7406f",
  red4: "#eb532e",
  yellow1: "#f49551",
  yellow2: "#ecee39",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        // <Box sx={{ p: 3 }}>
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Shop() {
  const { activeTabIndex, setActiveTabIndex, getShopGifts, getUserGifts, userGifts, shopGifts } = shopStore;

  const { authStore, modalStore } = rootStore;

  useEffect(() => {
    getShopGifts();
    if (authStore.uid) getUserGifts(authStore.uid);
  }, [authStore.uid, getShopGifts, getUserGifts]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const openModalHandler = (gift: Gift) => {
    shopStore.setGift(gift);
    modalStore.open({ type: "SHOW_GIFT" });
  };

  const setEmptyText = () => {
    if (!authStore.uid) return "Для того чтобы просмаривать подарки вам надо авторизоваться";

    return !userGifts?.length && "У вас пока нет подарков";
  };

  return (
    <PageLayout
      header={
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTabIndex}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="fullWidth"
            sx={{ color: "white" }}
            // indicatorColor="secondary"
            TabIndicatorProps={{ style: { background: "white" } }}
          >
            <Tab
              label="Мои"
              {...a11yProps(0)}
              style={{ backgroundColor: "#8000a9", color: "white" }}
              // style={{ backgroundColor: "white" }}
            />
            <Tab
              label="Магазин"
              {...a11yProps(1)}
              style={{ backgroundColor: "#8000a9", color: "white" }}
              // style={{ backgroundColor: "white" }}
            />
          </Tabs>
        </Box>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            width: "100%",
            height: {
              xs: "calc( 100vh - 50px - 60px )",
              sm: "calc( 100vh - 48px )",
            },
            overflowY: "auto",
          }}
        >
          <TabPanel value={activeTabIndex} index={0}>
            <Box
              sx={{
                p: 3,
                // height: {
                //   xs: 'calc( 100vh - 56px - 60px )',
                //   sm: 'calc( 100vh - 48px )',
                // },
              }}
            >
              <Typography color="white">{setEmptyText()}</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  // overflowY: "scroll",
                  // height: "calc(100vh - 48px)",
                  // p: 3,
                }}
              >
                {userGifts?.map((gift: Gift, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        width: {
                          xs: "calc(100% / 3)",
                          md: "20%",
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
                      onClick={() => openModalHandler(gift)}
                    />
                  );
                })}
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={activeTabIndex} index={1}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                p: 3,
              }}
            >
              {shopGifts?.map((gift: Gift, index) => {
                const category = gift.id.split("_")[0];

                return (
                  <Box
                    key={index}
                    sx={{
                      width: {
                        xs: "calc(100% / 3)",
                        md: "20%",
                      },
                      height: 200,
                      // backgroundSize: "75%",
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
                    onClick={() => openModalHandler(gift)}
                  >
                    <Box
                      sx={{
                        width: 35,
                        height: 35,
                        borderRadius: "50%",
                        backgroundColor: categoryToColor[category],
                        position: "absolute",
                        top: 20,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 14,
                      }}
                    >
                      {gift.price}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </TabPanel>
        </Box>

        <BaseModal
          isOpen={modalStore.visible("SHOW_GIFT")}
          closeModal={() => {
            modalStore.close();
          }}
        >
          <Box textAlign="center">
            <div
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "8px",
                display: "flex",
                position: "relative",
                backgroundSize: "75%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundImage: `url(${shopStore.gift?.image})`,
              }}
            />
            {activeTabIndex === 0 ? (
              <Button variant="contained" onClick={() => modalStore.close()}>
                ОК
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  modalStore.close();
                  shopStore.setGift(undefined);
                }}
              >
                Купить за {shopStore.gift?.price} ₽
              </Button>
            )}
          </Box>
        </BaseModal>
      </Box>
    </PageLayout>
  );
}

export default observer(Shop);
