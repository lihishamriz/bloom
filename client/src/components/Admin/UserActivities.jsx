import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { LoginOutlined, LogoutOutlined, AddShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';

import { Search } from '../../components';
import { handleError } from '../../services/utils';

const UserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const { data } = await axios.get('/admin/activities');
      setActivities(data);
      setFilteredActivities(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filterActivities = (value) => {
    const lowerCasedValue = value.toLowerCase();
    return activities.filter((activity) =>
      activity.email.toLowerCase().startsWith(lowerCasedValue)
    );
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" textAlign="center">
        User Activities
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: '340px',
          bgcolor: 'background.paper',
          margin: 'auto',
          marginTop: '20px'
        }}>
        <Search
          searchLabel="Search by email prefix"
          allItems={activities}
          setFilteredItems={setFilteredActivities}
          filterFunction={filterActivities}
        />
        <List dense>
          {filteredActivities.map((activity, index) => {
            return (
              <ListItem key={index} sx={{ marginBottom: '12px' }}>
                <ListItemAvatar>
                  <Avatar>
                    {activity.type === 'login' && (
                      <Tooltip title="Login">
                        <LoginOutlined />
                      </Tooltip>
                    )}
                    {activity.type === 'logout' && (
                      <Tooltip title="Logout">
                        <LogoutOutlined />
                      </Tooltip>
                    )}
                    {activity.type === 'addToCart' && (
                      <Tooltip title="Add to cart">
                        <AddShoppingCart />
                      </Tooltip>
                    )}
                  </Avatar>
                </ListItemAvatar>
                <Stack>
                  <Typography component="h5" variant="contained">
                    {activity.email}
                  </Typography>
                  {activity.productName && (
                    <Typography component="h5" variant="body2">
                      {activity.productName}
                    </Typography>
                  )}
                  <Typography component="h5" variant="body2">
                    {moment(new Date(activity.date)).format('DD-MM-YYYY HH:mm')}
                  </Typography>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Container>
  );
};

export default UserActivities;
