import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { handleError } from '../../services/utils';

const ContactUs = () => {
  const initialDetails = {
    subject: '',
    content: ''
  };

  const [details, setDetails] = useState(initialDetails);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setDetails({ ...details, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      await axios.post('/contact-us', details);
      toast.success('Message sent successfully');
      setDetails(initialDetails);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Typography component="h1" variant="h5">
          Contact Us
        </Typography>
        <Typography component="h5" variant="body1" marginTop="16px">
          Send us an email in any matter, and we will reach out to you as soon as possible!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            autoFocus
            type="text"
            margin="normal"
            autoComplete="off"
            id="subject"
            label="Subject"
            name="subject"
            value={details.subject}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            type="text"
            margin="normal"
            autoComplete="off"
            id="content"
            label="Content"
            name="content"
            multiline
            rows={6}
            value={details.content}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Send
          </Button>
          {isLoading && (
            <Box marginTop="12px" textAlign="center">
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ContactUs;
