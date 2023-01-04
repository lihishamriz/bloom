import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Grid, Typography, Box, TextField, Button, CssBaseline } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from 'axios';
import moment from 'moment';

import { handleError } from '../../../services/utils';

const Checkout = ({ products, sumToPay, setSumToPay, setIsToCheckout, setCheckoutProducts }) => {
  const initialDetails = {
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpirationDate: null,
    cardCVV: ''
  };

  const [details, setDetails] = useState(initialDetails);

  const handleChange = (event) => {
    setDetails({ ...details, [event.target.name]: event.target.value });
  };

  const handleDateChange = (event) => {
    setDetails({ ...details, ['cardExpirationDate']: event });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/cart/checkout', { details: details, products: products });
      toast.success('Payment is successful');
      setDetails(initialDetails);
      setCheckoutProducts([]);
      setSumToPay(0);
      goToCart();
    } catch (error) {
      handleError(error);
    }
  };

  const goToCart = () => {
    setIsToCheckout(false);
  };

  return (
    <Box width="400px" sx={{ margin: 'auto' }} component="form" onSubmit={handleSubmit}>
      <CssBaseline />
      <Typography variant="h5" marginBottom="20px" textAlign="center">
        Checkout
      </Typography>
      <Box>
        <Typography variant="h6" marginBottom="20px">
          Shipping address
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="address"
              name="address"
              label="Address"
              value={details.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="city"
              name="city"
              label="City"
              value={details.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="zip"
              name="zip"
              label="Zip Code"
              value={details.zip}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant="h6" marginBottom="20px" marginTop="20px">
          Credit card
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="cardNumber"
              name="cardNumber"
              label="Card Number"
              placeholder="XXXX XXXX XXXX XXXX"
              value={details.cardNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                id="expirationDate"
                label="Expiration Date"
                inputFormat="MM/DD/YYYY"
                value={details.cardExpirationDate}
                onChange={handleDateChange}
                minDate={moment()}
                renderInput={(params) => <TextField required {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              id="cvv"
              name="cardCVV"
              label="CVV"
              value={details.cardCVV}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ width: '100%', float: 'right' }}>
          <Typography marginTop="30px" textAlign="right" width="100%">
            Total: {sumToPay}$
          </Typography>
          <Grid container justifyContent="space-between">
            <Button onClick={() => goToCart()} variant="outlined" sx={{ mt: 3, mb: 2 }}>
              Back to Cart
            </Button>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Pay
            </Button>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Checkout;
