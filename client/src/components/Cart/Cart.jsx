import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Divider,
  Typography,
  Button,
  CssBaseline,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Checkbox
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

import { Checkout } from '../../components';

const Cart = ({
  products,
  removeFromCart,
  checkoutProducts,
  setCheckoutProducts,
  sumToPay,
  setSumToPay
}) => {
  const [isToCheckout, setIsToCheckout] = useState(false);

  const handleClick = () => {
    setIsToCheckout(true);
  };

  const handleCheckoutToggle = (product) => () => {
    const currentIndex = checkoutProducts.indexOf(product.id);
    const newChecked = [...checkoutProducts];

    if (currentIndex === -1) {
      newChecked.push(product.id);
      setSumToPay(sumToPay + parseInt(product.price));
    } else {
      newChecked.splice(currentIndex, 1);
      setSumToPay(sumToPay - parseInt(product.price));
    }

    setCheckoutProducts(newChecked);
  };

  return (
    <Box>
      {!isToCheckout && (
        <Box sx={{ width: '700px', bgcolor: 'background.paper', margin: 'auto' }}>
          <CssBaseline />
          <Typography component="h1" variant="h5" textAlign="center">
            Cart
          </Typography>
          {products.length === 0 && (
            <Typography marginTop="16px" textAlign="center" width="100%">
              There are no products in the cart
            </Typography>
          )}
          {products.length > 0 && (
            <Box>
              <List dense>
                {products.map((product) => {
                  return (
                    <Card key={product.id}>
                      <ListItem
                        key={product.id}
                        alignItems="center"
                        secondaryAction={
                          <Box width="100px">
                            <Tooltip title="Remove from cart">
                              <IconButton
                                aria-label="Remove from cart"
                                onClick={() => removeFromCart(product)}>
                                <DeleteOutline />
                              </IconButton>
                            </Tooltip>
                            <Checkbox
                              edge="end"
                              onChange={handleCheckoutToggle(product)}
                              checked={checkoutProducts.indexOf(product.id) !== -1}
                            />
                          </Box>
                        }
                        disablePadding>
                        <ListItemButton onClick={handleCheckoutToggle(product)}>
                          <ListItemAvatar id={product.id}>
                            <Box marginTop="8px">
                              <img alt="image" src={product.image} width="100px" height="100px" />
                            </Box>
                          </ListItemAvatar>
                          <ListItemText
                            primary={product.name}
                            sx={{ width: '150px', marginLeft: '20px' }}
                          />
                          <ListItemText
                            primary={product.description}
                            sx={{ width: '250px', marginLeft: '20px' }}
                          />
                          <ListItemText
                            primary={`${product.price}$`}
                            sx={{ width: '100px', marginLeft: '20px' }}
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </Card>
                  );
                })}
              </List>
              <Box sx={{ width: '120px', float: 'right' }}>
                <Typography marginTop="16px" textAlign="center" width="100%">
                  Total: {sumToPay}$
                </Typography>
                <Button
                  onClick={() => handleClick()}
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: '100%' }}
                  disabled={sumToPay === 0}>
                  Checkout
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
      {isToCheckout && (
        <Checkout
          products={checkoutProducts}
          setIsToCheckout={setIsToCheckout}
          setCheckoutProducts={setCheckoutProducts}
          sumToPay={sumToPay}
          setSumToPay={setSumToPay}
        />
      )}
    </Box>
  );
};

export default Cart;
