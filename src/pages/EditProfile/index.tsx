import { useEffect } from "react";
import { Autocomplete, Box, Button, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";
// import CancelIcon from "@mui/icons-material/Cancel";

import { observer } from "mobx-react-lite";
import editProfileStore from "./store";
import rootStore from "../../store";
import cities, { CityOption } from "../../mock/cities";
import { Image } from "../../types";
import PageLayout from "../../components/PageLayout";
import BaseAppBar from "../../components/BaseAppBar";
// import { wallpaperImage } from '../../const';

const locales = "ru" as const;

const EditProfile = () => {
  const { userStore } = rootStore;
  const {
    isLoading,
    fields,
    setFields,
    onChange,
    setDate,
    setCity,
    imagePreview,
    setWallpaperFile,
    submitForm,
    changeWallpaper,
    setFetchState,
    toggleInvisible,
  } = editProfileStore;

  const { name, surname, wallpaper, invisible } = fields;

  useEffect(() => {
    if (!userStore.user?.id) {
      setFetchState("pending");
    } else {
      setFields(userStore.user);
      setFetchState("done");
    }
  }, [setFetchState, setFields, userStore.user, userStore.user?.id]);

  const onChangeWallpaperHandler = (e: any) => {
    setWallpaperFile(e);
    changeWallpaper();
  };

  // const isShowCloseBtn = (wallpaper as Image)?.imageId || imagePreview;

  return (
    <PageLayout hasBacking header={<BaseAppBar title="Редактирование профиля" />}>
      <Box
        sx={{
          p: 4,
          // background: "#ffffffba",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              id="outlined-basic1"
              label="Имя"
              value={name || ""}
              onChange={onChange}
              variant="outlined"
              fullWidth
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="surname"
              id="outlined-basic2"
              label="Фамилия"
              value={surname || ""}
              onChange={onChange}
              variant="outlined"
              fullWidth
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>
              <DesktopDatePicker
                label="Дата рождения"
                inputFormat="MM/DD/YYYY"
                value={fields.birthday}
                onChange={(val) => setDate(val as Dayjs)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                disabled={isLoading}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              disablePortal
              options={cities}
              value={fields["city"]}
              getOptionLabel={(city: any) => {
                return city ? `${city.label} (${city.region})` : "";
              }}
              noOptionsText="Нет подходящих городов"
              onChange={(_, v) => setCity(v as CityOption)}
              renderInput={(params) => <TextField label="Город" {...params} />}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            {isLoading ? (
              <Skeleton
                variant="rounded"
                animation="wave"
                width="100%"
                height={200}
                sx={{
                  width: "100%",
                  flexGrow: 1,
                  bgcolor: "grey.500",
                  opacity: 0.5,
                }}
              />
            ) : (
              <>
                <Box sx={{ position: "relative" }}>
                  {/* {isShowCloseBtn && (
                  <CancelIcon
                    onClick={async () => {
                      // стереть превью
                      // установить
                    }}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      zIndex: 1000,
                      fontSize: 28,
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  />
                )} */}
                  <label htmlFor="upload">
                    <Box
                      sx={{
                        width: "100%",
                        height: "200px",
                        border: "1px dashed #8000a9",
                        borderRadius: "8px",
                        display: "flex",
                        cursor: "pointer",
                        position: "relative",
                        backgroundImage: `url(${imagePreview || (wallpaper as Image)?.imageSrc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></Box>
                  </label>

                  <input type="file" id="upload" name="wallpaper" onChange={onChangeWallpaperHandler} style={{ display: "none" }} />
                </Box>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={Boolean(invisible)} onChange={(e) => toggleInvisible(e.target.checked)} />}
                label="Невидимка"
                disabled={isLoading}
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <Button variant="contained" size="large" disabled={isLoading} onClick={submitForm}>
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default observer(EditProfile);
