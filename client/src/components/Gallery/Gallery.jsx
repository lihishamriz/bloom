import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ImageList,
  ImageListItem,
  CssBaseline,
  Box,
  Typography,
  Container,
  TextField,
  Tooltip,
  IconButton
} from '@mui/material';
import { AddAPhotoOutlined } from '@mui/icons-material';
import axios from 'axios';
import { handleError } from '../../services/utils';

const Gallery = () => {
  const initialImage = {
    img: '',
    title: ''
  };

  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(initialImage);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/gallery');
      setImages(data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleChange = (event) => {
    setNewImage({ ...newImage, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put('/gallery/add', newImage);
      setImages([...images, newImage]);
      setNewImage(initialImage);
      toast.success('Added image successfully');
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Container maxWidth="600px">
      <CssBaseline />
      <Typography component="h1" variant="h5" textAlign="center">
        Gallery
      </Typography>
      <Typography component="h5" variant="body1" marginTop="16px" textAlign="center">
        Add images of your favorite flowers to take part in our gallery!
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          margin: 'auto',
          height: '100px',
          width: '600px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <TextField
          required
          autoFocus
          type="text"
          autoComplete="off"
          id="title"
          label="Title"
          name="title"
          value={newImage.title}
          onChange={handleChange}
          sx={{ marginRight: '20px', width: '200px' }}
        />
        <TextField
          required
          type="url"
          autoComplete="off"
          id="image"
          label="Image URL"
          name="img"
          value={newImage.img}
          onChange={handleChange}
          sx={{ marginRight: '10px', width: '380px' }}
        />
        <Tooltip title="Add Image">
          <IconButton
            aria-label="Add Image"
            color="inherit"
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            <AddAPhotoOutlined />
          </IconButton>
        </Tooltip>
      </Box>
      <ImageList
        sx={{ width: 600, height: 420, margin: 'auto', marginTop: '8px' }}
        cols={4}
        rowHeight={164}>
        {images.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
};

export default Gallery;
