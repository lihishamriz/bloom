import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
  Stack
} from '@mui/material';
import {
  SupervisorAccountRounded,
  LoginRounded,
  LogoutRounded,
  ShoppingCart,
  HistoryOutlined,
  EditOutlined,
  DeleteOutlined
} from '@mui/icons-material';
import axios from 'axios';

import logo from '../../assets/blue-flower.png';
import { handleError } from '../../services/utils';

const Navbar = ({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, cartBadge }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const onAdminClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdminClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setIsLoggedIn(false);
      setIsAdmin(false);
      toast.success('Logged out successfully');
      navigate('/store');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <Box display="flex" width="100%" justifyContent="space-between" marginTop="auto">
          <Box display="flex" flex="1" marginBottom="8px">
            <img src={logo} alt="Bloom" height="50px" />
            <Typography
              variant="h4"
              color="inherit"
              fontFamily="cursive"
              marginTop="8px"
              marginLeft="8px">
              Bloom
            </Typography>
          </Box>
          <Stack spacing={2} direction="row">
            <Button component={RouterLink} to="/store">
              Store
            </Button>
            {isLoggedIn && (
              <Button component={RouterLink} to="/gallery">
                Gallery
              </Button>
            )}
            {isLoggedIn && (
              <Button component={RouterLink} to="/club">
                Club
              </Button>
            )}
            {isLoggedIn && (
              <Button component={RouterLink} to="/reviews">
                Reviews
              </Button>
            )}
            {isLoggedIn && (
              <Button component={RouterLink} to="/contact-us">
                Contact Us
              </Button>
            )}
          </Stack>
          <Box display="flex" flex="1" justifyContent="flex-end" height="40px" marginTop="8px">
            {isAdmin && (
              <Tooltip title="Admin">
                <IconButton aria-label="Admin" color="inherit" onClick={onAdminClick}>
                  <SupervisorAccountRounded />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleAdminClose}
              onClick={handleAdminClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              <MenuItem component={RouterLink} to="/admin/user-activities">
                <ListItemIcon>
                  <HistoryOutlined fontSize="small" />
                </ListItemIcon>
                User Activities
              </MenuItem>
              <MenuItem component={RouterLink} to="/admin/add-product">
                <ListItemIcon>
                  <EditOutlined fontSize="small" />
                </ListItemIcon>
                Add Product
              </MenuItem>
              <MenuItem component={RouterLink} to="/admin/remove-product">
                <ListItemIcon>
                  <DeleteOutlined fontSize="small" />
                </ListItemIcon>
                Remove Product
              </MenuItem>
            </Menu>
            {!isLoggedIn && (
              <Tooltip title="Login">
                <IconButton aria-label="Login" color="inherit" component={RouterLink} to="/login">
                  <LoginRounded />
                </IconButton>
              </Tooltip>
            )}
            {isLoggedIn && (
              <Tooltip title="Logout">
                <IconButton aria-label="Sign out" color="inherit" onClick={logout}>
                  <LogoutRounded />
                </IconButton>
              </Tooltip>
            )}
            {isLoggedIn && (
              <Tooltip title="Cart">
                <IconButton aria-label="Cart" color="inherit" component={RouterLink} to="/cart">
                  <Badge badgeContent={cartBadge} color="primary" overlap="rectangular">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
