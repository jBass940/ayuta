import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import "dayjs/locale/ru";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import Api from "../../api";
import { observer } from "mobx-react-lite";
import postStore from "./store";
import rootStore from "./../../store";
import { useEffect } from "react";
import BaseAppBar from "../../components/BaseAppBar";
import PageLayout from "../../components/PageLayout";

const AddPostPage = () => {
  const { authStore } = rootStore;

  const { form, onChange, setAvatarPreview, avatarPreviewLocalUrl, submitForm, clearForm } = postStore;

  useEffect(() => {
    return () => clearForm();
  }, [clearForm]);

  const handleChangeImage = (e: any) => {
    setAvatarPreview(e.target.files[0]);
  };

  return (
    <PageLayout header={<BaseAppBar title="Добавить публикацию" />}>
      <Box
        sx={{
          p: 4,
          pb: 8,
          // background: "#ffffff2b",
          background: "#ffffffba",
          height: "100vh",
        }}
      >
        {/* <h2>Добавление новой публикации</h2> */}

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              maxRows={4}
              name="title"
              id="outlined-basic1"
              label="Название публикации"
              value={form.title}
              onChange={(e) => onChange(e)}
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              rows={10}
              // maxRows={4}
              name="text"
              id="outlined-baыsic1"
              label="Текст публикации"
              value={form.text}
              onChange={(e) => onChange(e)}
              variant="outlined"
              fullWidth
              multiline
            />
          </Grid>

          <Grid item xs={6}>
            <label htmlFor="upload">
              <Typography variant="body1" sx={{ mb: 1 }}>
                Добавить фото
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                  border: "1px dashed #8000a9",
                  borderRadius: "8px",
                  display: "flex",
                  cursor: "pointer",
                  position: "relative",
                  // backgroundImage: `url(${store.fields?.wallpaper.value})`,
                  backgroundImage: `url(${avatarPreviewLocalUrl})`,

                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <AddCircleIcon
                  sx={{
                    margin: "auto",
                    fontSize: "80px",
                    opacity: 0.3,
                    color: "#8000a9",
                  }}
                />
              </Box>
            </label>

            <input type="file" id="upload" name="wallpaper" onChange={handleChangeImage} style={{ display: "none" }} />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              // disabled={!isValid()}
              onClick={async () => {
                let image: Record<string, string> = {};
                if (form.image) {
                  const resp = await Api.file.uploadImage(authStore.uid, form.image);

                  if (resp) image = resp;
                }

                await Api.post
                  .create(authStore.uid, {
                    createdAt: String(Date.now()),
                    imageSrc: image.imageSrc,
                    imageId: image.imageId,
                    title: form.title,
                    text: form.text,
                    isBlog: true,
                  })
                  .then(() => {
                    // rootStore.modalStore.openModal("Пост успешно создан");
                    clearForm();
                  });

                // submitForm();
              }}
            >
              Опубликовать пост
            </Button>
          </Grid>
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default observer(AddPostPage);
