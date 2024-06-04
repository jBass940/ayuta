import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import rootStore from './../../store';
import { observer } from 'mobx-react-lite';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = () => {
  const { notificationStore } = rootStore;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    notificationStore.setNotificationtext('');
  };

  return (
    <Snackbar
      open={!!notificationStore.notificationText}
      autoHideDuration={6000}
      // anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {notificationStore.notificationText}
      </Alert>
    </Snackbar>
  );
};
export default observer(Notification);
