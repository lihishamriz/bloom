import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Grid
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

const Product = ({ isLoggedIn, product, addToCart }) => {
  const navigate = useNavigate();

  const addToCartAndValidate = async (productName) => {
    if (!isLoggedIn) {
      toast.info('You must login to use the cart');
      navigate('/login');
      return;
    }
    await addToCart(productName);
  };

  return (
    <Card sx={{ maxWidth: '300px', margin: 'auto' }}>
      <CardMedia component="img" image={product.image} />
      <CardContent>
        <Grid display="flex" justifyContent="space-between">
          <Typography gutterBottom variant="h6">
            {product.name}
          </Typography>
          <Typography variant="h6">{product.price}$</Typography>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          height="20px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="noWrap">
          {product.description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          size="small"
          aria-label="Add to Cart"
          onClick={() => addToCartAndValidate(product.name)}>
          <AddShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Product;
