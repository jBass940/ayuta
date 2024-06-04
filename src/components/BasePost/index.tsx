import * as React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Post } from "../../types";

type Props = {
  userId?: string;
  post: Post;
};

const BasePost = ({ userId, post }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: {
          sx: 0,
          md: 2,
        },
      }}
      onClick={() => {
        console.log(`/post/${userId}/${post.imageId}`);
        userId && navigate(`/post/${userId}/${post.postId}`);
      }}
    >
      <CardActionArea sx={{ borderRadius: 0 }}>
        {post?.imageSrc && <CardMedia component="img" height="400" image={String(post.imageSrc)} alt="" />}
        {(post.title || post.text) && (
          <CardContent>
            {post.title && (
              <Typography gutterBottom variant="h5" component="div">
                {post.title}
              </Typography>
            )}
            {post.text && (
              <Typography variant="body2" color="text.secondary">
                {post.text}
              </Typography>
            )}
          </CardContent>
        )}
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default BasePost;
