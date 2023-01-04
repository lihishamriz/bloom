import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, CssBaseline, TextField, Box, Typography, Container } from '@mui/material';
import axios from 'axios';

import { handleError } from '../../services/utils';

const AddProduct = ({ setAllProducts }) => {
  const initialProduct = {
    name: '',
    description: '',
    price: '',
    image: ''
  };

  const navigate = useNavigate();
  const [product, setProduct] = useState(initialProduct);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.put('/admin/add-product', product);
      setAllProducts(data.products);
      toast.success('Added product successfully');
      navigate('/store');
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
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
          Add Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            autoFocus
            type="text"
            margin="normal"
            autoComplete="off"
            id="name"
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            type="text"
            margin="normal"
            autoComplete="off"
            id="description"
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            type="number"
            margin="normal"
            autoComplete="off"
            id="price"
            label="Price"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
          <TextField
            required
            fullWidth
            type="url"
            margin="normal"
            autoComplete="off"
            id="image"
            label="Image URL"
            name="image"
            value={product.image}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Add Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddProduct;
