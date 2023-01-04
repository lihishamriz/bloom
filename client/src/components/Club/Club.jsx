import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, Box, Typography, Container } from '@mui/material';
import axios from 'axios';

import clubImage from '../../assets/flowers-club.jpeg';
import { handleError } from '../../services/utils';

const Club = () => {
  const [isClubMember, setIsClubMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/club/is-club-member');
      setIsClubMember(data.isClubMember);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const joinTheClub = async () => {
    try {
      await axios.post('/club/join-the-club');
      setIsClubMember(true);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Box>
      {!isLoading && (
        <Container maxWidth="600px">
          <CssBaseline />
          <Typography component="h1" variant="h5" textAlign="center">
            Our Club
          </Typography>
          {!isClubMember && (
            <Box
              sx={{
                height: '170px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Typography component="h2" variant="body1" marginTop="16px">
                Join the club and get exclusive coupons and discounts on a monthly basis, up to 50%
                off!
              </Typography>
              <Typography component="h5" variant="body1" marginTop="16px">
                The discount will be accepted right after registration | No double deals / discounts
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 4 }}
                onClick={() => {
                  joinTheClub();
                }}>
                Join the Club!
              </Button>
            </Box>
          )}
          {isClubMember && (
            <Box
              sx={{
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Typography component="h2" variant="body1" marginTop="16px">
                You are a club member
              </Typography>
              <Typography component="h5" variant="body1" marginTop="16px">
                We hope you enjoy our club!
              </Typography>
            </Box>
          )}
          <Box textAlign="center">
            <img src={clubImage} alt="Bloom" width="400px" height="400px" />
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default Club;
