import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Skeleton, styled } from '@mui/material';
import { Box, TextareaAutosize } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';

const Icon = styled(Box)(() => ({
  position: 'absolute',
  zIndex: 10,
  top: 14,
  right: 14,
  color: '#8000a9',
}));

type Props = {
  isLoading: boolean;
  isShow: boolean;
  status: string;
  isDisabled: boolean;
  onSave: (newStatus: string) => Promise<void>;
  onSuccessSave: () => void;
};

function Status({
  isLoading,
  isShow,
  status,
  isDisabled,
  onSave,
  onSuccessSave,
}: Props) {
  const [localState, setLocalState] = useState('');
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  useEffect(() => {
    setLocalState(status);
  }, [status]);

  const onSaveHandler = () => {
    setIsLocalLoading(true);
    onSave(localState).then(() => {
      setIsLocalLoading(false);
      onSuccessSave();
    });
  };

  const isShowIcons = !isDisabled && status !== localState;

  if (!isShow) return null;

  // if (isLoading) {
  //   return (
  //     <Skeleton
  //       variant="rounded"
  //       animation="wave"
  //       width="100%"
  //       height={52.73}
  //       sx={{
  //         // mb: "12.27px",
  //         bgcolor: 'grey.100',
  //         opacity: 0.5,
  //       }}
  //     />
  //   );
  // }

  return (
    <>
      <Box
        sx={{
          height: '49px',
          // mb: "12.27px", // 16 - 3.73
          position: 'relative',
          cursor: 'pointer',
          width: 'auto',
          // overflow: 'hidden',
          // border: 'none',
          // boxSizing: 'border-box',
          mx: {
            xs: 1,
            md: 0,
          },
        }}
      >
        <TextareaAutosize
          name="status"
          maxRows={6}
          aria-label="empty textarea"
          placeholder="Введите ваш статус"
          value={localState}
          onChange={(e) => setLocalState(e.target.value)}
          disabled={isDisabled}
          style={{
            backgroundColor: '#ffffffba',
            padding: '16px 32px 16px 16px',
            margin: 0,
            boxSizing: 'border-box',
            outline: 'none',
            width: '100%',
            borderRadius: 10,
            border: 'none',
            fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
            resize: 'none',
            fontSize: 14,
          }}
        />

        <Icon>
          {isShowIcons && (
            <>
              {isLocalLoading ? (
                <CircularProgress size={18} />
              ) : (
                <>
                  <ClearIcon
                    onClick={() => setLocalState(status)}
                    sx={{ mr: 1 }}
                  />
                  <EditIcon onClick={onSaveHandler} />
                </>
              )}
            </>
          )}
        </Icon>
      </Box>
    </>
  );
}

export default observer(Status);
