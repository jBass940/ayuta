import * as React from 'react';
import { Box, Skeleton, styled, Typography } from '@mui/material';

type CardType = React.HTMLAttributes<HTMLElement> & {
  header: string;
  // content: React.ReactElement;
  main: any;
  footer: React.ReactElement;
  isOpacity?: boolean;
  noFriends?: boolean;
  isLoading: boolean;
};

const Wrapper = styled(Box)(() => ({
  backgroundColor: '#ffffffba',
  // borderRadius: '8px',
  // padding: '16px',
}));

const Content = styled(Box)(() => ({
  margin: '10px 0',
  overflow: 'hidden',
}));

const Footer = styled(Box)(() => ({
  fontSize: 14,
  color: 'black',
}));

const BaseBox: React.FC<CardType> = ({
  isLoading,
  header,
  main,
  footer,
  isOpacity,
  noFriends,
  ...props
}) => {
  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height={199}
        sx={{
          width: '100%',
          flexGrow: 1,
          // mb: 2,
          bgcolor: 'grey.100',
          opacity: 0.5,
        }}
      />
    );
  }

  return (
    <Wrapper
      {...props}
      sx={{
        py: 2,
        px: { xs: 0, md: 2 },
        borderRadius: {
          sx: 0,
          md: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}
      >
        <Typography
          sx={{ fontSize: '18px', fontWeight: 'bold', pl: { xs: 2, md: 0 } }}
        >
          {header}
        </Typography>
        {noFriends && <Footer>{footer}</Footer>}
      </Box>
      <Content style={{ opacity: !isOpacity ? '0.5' : '1' }}>{main}</Content>
    </Wrapper>
  );
};

export default BaseBox;
