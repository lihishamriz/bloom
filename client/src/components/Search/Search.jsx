import React, { useState, useEffect } from 'react';
import { OutlinedInput, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Search = ({ searchLabel, allItems, setFilteredItems, filterFunction }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = async (e) => {
    setSearchValue(e.target.value);
  };

  const filterItems = () => {
    if (searchValue) {
      setFilteredItems(filterFunction(searchValue));
    } else {
      setFilteredItems(allItems);
    }
  };

  useEffect(() => {
    filterItems();
  }, [searchValue, allItems]);

  return (
    <OutlinedInput
      sx={{ ml: 1, flex: 1, width: '100%', marginBottom: 2 }}
      value={searchValue}
      placeholder={searchLabel}
      onChange={handleChange}
      size="small"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      inputProps={{
        'aria-label': searchLabel
      }}
    />
  );
};

export default Search;
