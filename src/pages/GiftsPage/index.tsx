import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import store from './store';
import { setAvatar } from '../../utils/setAvatar';
import { observer } from 'mobx-react-lite';
import Crown from '../../components/Crown';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useParams } from 'react-router-dom';
import { Gift } from '../../types';
import BaseAppBar from '../../components/BaseAppBar';

type RouterParams = {
  id: string;
};

const Badge = ({ color }: { color: string }) => {
  return (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        // backgroundColor: isOnline ? '#45b344' : 'gray',
        backgroundColor: color,
        position: 'relative',
        top: '1px',
        // bottom: 5,
        // right: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        mr: 1,
      }}
    />
  );
};

function GiftsPage() {
  const { id } = useParams<RouterParams>();

  useEffect(() => {
    store.fetchGifts(String(id));

    return () => {
      store.clear();
    };
  }, [id]);

  return (
    <div>
      <BaseAppBar title="Подарки" />

      <Grid container spacing={0}>
        <Grid item xs={12} md={12}>
          {store.isLoadUsers && (
            <Box sx={{ height: '100vh', width: '100%', display: 'flex' }}>
              <CircularProgress
                size={50}
                sx={{ margin: 'auto', color: 'white' }}
              />
            </Box>
          )}

          {!store.isLoadUsers && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                overflowY: 'scroll',
                height: 'calc(100vh - 48px)',
                p: 3,
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {store.gifts.map((gift: Gift, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      width: {
                        xs: '50%',
                        md: '20%',
                      },
                      height: 200,
                      // backgroundSize: "75%",
                      backgroundSize: '85%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundImage: `url(${gift?.image})`,
                      position: 'relative',
                      cursor: 'pointer',
                      scrollbarWidth: 0,
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                    //  onClick={() => openModalHandler(gift)}
                  ></Box>
                );
              })}
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default observer(GiftsPage);
