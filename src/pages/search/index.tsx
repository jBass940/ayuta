import * as React from "react";
import { useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import store from "./store";
import { setAvatar } from "../../utils/setAvatar";
import { observer } from "mobx-react-lite";
import Crown from "../../components/Crown";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import BaseAppBar from "../../components/BaseAppBar";
import cities, { CityOption } from "../../mock/cities";
import EmptyBlock from "../../components/EmptyBlock";
import { IconButton } from "@mui/material";
import PageLayout from "../../components/PageLayout";
import { Image } from "mui-image";

type Anchor = "top" | "left" | "bottom" | "right";

const Badge = ({ color }: { color: string }) => {
  return (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        // backgroundColor: isOnline ? '#45b344' : 'gray',
        backgroundColor: color,
        // position: 'relative',
        // top: '1px',
        // bottom: 5,
        // right: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 14,
        ml: 1,
        flexGrow: 1,
        flexShrink: 0,
      }}
    />
  );
};

function Search() {
  const [state, setState] = React.useState({
    bottom: false,
  });

  useEffect(() => {
    store.fetchUsers().then(() => {
      console.log("данные юзеров получены");
    });

    return () => {
      store.clear();
    };
  }, []);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const SearchMaterial = observer(() => {
    return (
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          backgroundColor: "#ffffffba",
          p: 3,
          position: "sticky",
          top: 0,
        }}
      >
        <TextField
          fullWidth
          label="Имя"
          variant="outlined"
          sx={{ pb: 2 }}
          value={store.filter.name}
          onChange={(e) => store.updateFilter("name", e.target.value)}
        />
        <TextField
          fullWidth
          label="Фамилия"
          variant="outlined"
          sx={{ pb: 2 }}
          value={store.filter.surname}
          onChange={(e) => store.updateFilter("surname", e.target.value)}
        />
        <TextField fullWidth label="Страна" variant="outlined" disabled sx={{ pb: 2 }} value="Россия" />
        <Autocomplete
          disablePortal
          options={cities}
          value={store.filter.city}
          getOptionLabel={(city: any) => {
            return city ? `${city.label} (${city.region})` : "";
          }}
          noOptionsText="Нет подходящих городов"
          onChange={(_, newValue) => store.updateFilter("city", newValue ? (newValue as CityOption) : null)}
          renderInput={(params) => <TextField {...params} label="Город" />}
        />

        <Box>
          <Box sx={{ my: 1 }}>Пол:</Box>
          <Box sx={{ display: "flex" }}>
            <ToggleButtonGroup
              color="primary"
              value={store.filter.sex}
              exclusive
              onChange={(_, newValue) => store.updateFilter("sex", newValue)}
              sx={{ width: "100%" }}
            >
              <ToggleButton value="Мужчина" style={{ width: "50%" }}>
                Мужчина
              </ToggleButton>
              <ToggleButton value="Женщина" style={{ width: "50%" }}>
                Женщина
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <Box>
          <Box sx={{ my: 1 }}>Возраст:</Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              type="number"
              value={store.filter.ageFrom}
              onChange={(e) => store.updateFilter("ageFrom", e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">от</InputAdornment>,
              }}
            />
            <TextField
              value={store.filter.ageTo}
              onChange={(e) => store.updateFilter("ageTo", e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">до</InputAdornment>,
              }}
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            store.applyFilter();
            setState({ bottom: false });
          }}
        >
          Искать
        </Button>
        <Button variant="contained" size="large" fullWidth sx={{ mt: 2 }} disabled={!store.isFilterNotEmpty} onClick={() => store.clearFilter()}>
          Очистить фильтр
        </Button>
      </Box>
    );
  });

  return (
    <PageLayout
      header={
        <BaseAppBar title="Поиск">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setState({ bottom: true })}
            sx={{
              display: {
                md: "none",
              },
            }}
          >
            <Box
              sx={{
                width: "25px",
                height: "25px",
                backgroundImage: `url(/params.svg)`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </IconButton>
        </BaseAppBar>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={8}>
            {store.isLoadUsers && (
              <Box sx={{ height: "100vh", width: "100%", display: "flex" }}>
                <CircularProgress size={50} sx={{ margin: "auto", color: "white" }} />
              </Box>
            )}

            {!store.isLoadUsers && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                  height: {
                    xs: "calc( 100vh - 56px - 60px )",
                    sm: "calc( 100vh - 48px )",
                  },
                  overflowY: "auto",
                  boxSizing: "border-box",
                  // overflowX: 'auto',
                  scrollbarWidth: 0,
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {!!store.filteredUsers.length &&
                  store.filteredUsers.map((user, index) => (
                    <Box
                      sx={{
                        width: {
                          xs: "calc(100% / 3)",
                          md: "calc(100% / 3)",
                        },
                        height: {
                          xs: 160,
                          sm: 220,
                        },
                      }}
                    >
                      <Link key={index} to={`/profile/${user.id}`}>
                        <Box
                          key={index}
                          sx={{
                            // width: "25%",
                            width: "100%",
                            height: {
                              xs: 160,
                              sm: 220,
                            },
                            // backgroundImage: `url(${setAvatar(user)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          <Image
                            src={`${setAvatar(user)}`}
                            width={"100%"}
                            height={"100%"}
                            alt={user.name}
                            duration={300}
                            bgColor="#ffffffba"
                            showLoading
                          />
                          <Crown offset={10} size={20} enable={user?.isVip} />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              zIndex: 2,
                              p: 1,
                              color: "white",
                              fontSize: 15,
                              display: "flex",
                              // justifyContent: 'center',
                              alignItems: "center",
                            }}
                          >
                            {user?.name} {user?.surname}
                            <Badge color={user?.isOnline ? "#45b344" : "gray"} />
                          </Box>
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
                      </Link>
                    </Box>
                  ))}

                {!store.filteredUsers.length && <EmptyBlock title="Нет пользователей по запросу" />}
              </Box>
            )}
          </Grid>
          <Grid
            item
            xs={0}
            md={4}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <SearchMaterial />
          </Grid>
        </Grid>

        <div>
          <React.Fragment key={"bottom"}>
            {/* @ts-ignore */}
            <SwipeableDrawer
              anchor={"bottom"}
              open={state["bottom"]}
              onClose={toggleDrawer("bottom", false)}
              onOpen={toggleDrawer("bottom", true)}
              style={{ overflow: "auto" }}
            >
              <SearchMaterial />
            </SwipeableDrawer>
          </React.Fragment>
        </div>
      </Box>
    </PageLayout>
  );
}

export default observer(Search);
