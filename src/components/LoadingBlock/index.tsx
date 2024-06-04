import { Box, CircularProgress } from '@mui/material';

const LoadingBlock = () => {
  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex' }}>
      <CircularProgress size={50} sx={{ margin: 'auto', color: 'white' }} />
    </Box>
  );
};

export default LoadingBlock;
