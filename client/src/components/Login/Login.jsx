import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CssBaseline
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import axios from 'axios';

import { handleError } from '../../services/utils';

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const navigate = useNavigate();

  const initialDetails = {
    email: '',
    password: '',
    rememberMe: false
  };

  const [details, setDetails] = useState(initialDetails);

  const handleCheckboxToggle = () => {
    setDetails({ ...details, rememberMe: !details.rememberMe });
  };

  const handleChange = (event) => {
    setDetails({ ...details, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/auth/login', details);
      setIsLoggedIn(true);
      if (details.email === 'admin') {
        setIsAdmin(true);
      }
      toast.success('Logged in successfully');
      setDetails(initialDetails);
      navigate('/store');
    } catch (error) {
      handleError(error);
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
        <Avatar sx={{ m: 1 }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoFocus
            value={details.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={details.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                onChange={handleCheckboxToggle}
                checked={details.rememberMe}
              />
            }
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="/sign-up" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
