import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CssBaseline,
  Button,
  Box,
  Typography,
  Container,
  MenuItem,
  FormControl,
  TextField
} from '@mui/material';
import axios from 'axios';

import { handleError } from '../../services/utils';

const RemoveProduct = ({ allProducts, setAllProducts }) => {
  const navigate = useNavigate();

  const [productId, setProductId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.delete(`/admin/remove-product/${productId}`);
      const updatedProducts = allProducts.filter((product) => product.id !== productId);
      setAllProducts(updatedProducts);
      toast.success('Removed product successfully');
      navigate('/store');
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (event) => {
    setProductId(event.target.value);
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
        <Typography component="h1" variant="h5" marginBottom="16px">
          Remove Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <TextField
              select
              required
              label="Product Name"
              value={productId}
              onChange={handleChange}
              sx={{ width: '400px' }}>
              {allProducts.map((product) => {
                return (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </FormControl>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, width: '400px' }}>
            Remove Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RemoveProduct;
