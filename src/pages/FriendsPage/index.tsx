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

function FriendsPage() {
  const { id } = useParams<RouterParams>();

  useEffect(() => {
    store.fetchFriends(String(id));

    return () => {
      store.clear();
    };
  }, [id]);

  return (
    <div>
      <BaseAppBar title="Друзья" />

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
                height: '100vh',
                boxSizing: 'border-box',
                overflowX: 'auto',
                scrollbarWidth: 0,
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {!!store.friends.length &&
                store.friends.map((user, index) => (
                  <Box
                    sx={{
                      width: {
                        xs: '50%',
                        md: 'calc(100% / 5)',
                      },
                      // height: {
                      //   xs: 220,
                      //   md: 300,
                      // },
                      height: 200,
                    }}
                  >
                    <Link key={index} to={`/profile/${user.id}`}>
                      <Box
                        key={index}
                        sx={{
                          // width: "25%",
                          width: '100%',
                          backgroundImage: `url(${setAvatar(user)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                          cursor: 'pointer',
                          // height: {
                          //   xs: 220,
                          //   md: 300,
                          // },
                          height: 200,
                        }}
                      >
                        <Crown offset={10} size={20} enable={user?.isVip} />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            zIndex: 2,
                            p: 2,
                            color: 'white',
                            fontSize: 15,
                            display: 'flex',
                            // justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Badge color={user?.isOnline ? '#45b344' : 'gray'} />
                          {user?.name} {user?.surname}
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                            width: '100%',
                            height: '100%',
                            background:
                              'linear-gradient(0deg, rgba(0,0,0,0.67) 0%, rgba(255,255,255,0) 100%)',
                          }}
                        />
                      </Box>
                    </Link>
                  </Box>
                ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default observer(FriendsPage);
