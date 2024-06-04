import { Grid } from "@mui/material";
import { useMediaQuery } from "@mui/material";

type Props = {
  leftColumnContent: JSX.Element;
  rightColumnContent: JSX.Element;
};

const Profile = ({ leftColumnContent, rightColumnContent }: Props) => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <div>
      <Grid
        container
        item
        flexGrow={1}
        spacing={0}
        wrap={matches ? "wrap" : "nowrap"}
        gap={2}
        sx={{
          pt: 2,
          pb: 2,
          pl: 2,
          pr: 2,
          xs: {
            p: 0,
          },
        }}
      >
        <Grid item xs={12} sm={12} md={4} lg={8}>
          1{leftColumnContent}
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={8}>
          2{rightColumnContent}
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
