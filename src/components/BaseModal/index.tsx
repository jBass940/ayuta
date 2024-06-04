import * as React from 'react';
import { Box, Modal, SxProps, Theme, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type CardType = {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  children: JSX.Element;
  sx?: SxProps<Theme>;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '80vw',
    md: '400px',
  },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const BaseModal: React.FC<CardType> = ({
  isOpen,
  closeModal,
  title,
  children,
  sx,
}) => {
  return (
    <Modal open={isOpen} onClose={() => closeModal()}>
      {/* @ts-ignore */}
      <Box sx={{ ...style, ...sx }}>
        <CloseIcon
          onClick={() => closeModal()}
          sx={{
            fontSize: 32,
            position: 'absolute',
            right: 15,
            top: 15,
            zIndex: 10,
            cursor: 'pointer',
          }}
        />
        {title && (
          <Typography variant="h5" component="h2" sx={{ m: 0, mb: 2 }}>
            {title}
          </Typography>
        )}
        <Box sx={{ overflowY: 'auto' }}>{children}</Box>
      </Box>
    </Modal>
  );
};

export default BaseModal;
