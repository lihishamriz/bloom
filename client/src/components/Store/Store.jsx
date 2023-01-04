import React from 'react';
import { Box, Grid } from '@mui/material';

import { Search, Product } from '../../components';

const Store = ({ isLoggedIn, allProducts, filteredProducts, setFilteredProducts, addToCart }) => {
  const filterProducts = (value) => {
    const lowerCasedValue = value.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCasedValue) ||
        product.description.toLowerCase().includes(lowerCasedValue)
    );
  };

  return (
    <Box>
      <Box sx={{ marginLeft: '4px', marginBottom: '8px', width: 300 }}>
        <Search
          searchLabel="Search by title or description"
          allItems={allProducts}
          setFilteredItems={setFilteredProducts}
          filterFunction={filterProducts}
        />
      </Box>
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.name} xs={12} sm={6} lg={3}>
            <Product isLoggedIn={isLoggedIn} product={product} addToCart={addToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Store;
