import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  List,
  ListItem,
  Box,
  Rating,
  Typography,
  Card,
  CardContent,
  Grid,
  CssBaseline,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { handleError } from '../../services/utils';

const Reviews = () => {
  const initialReview = {
    stars: 0,
    comment: ''
  };

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState(initialReview);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/reviews');
      setReviews(data);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStarsChange = (event) => {
    setNewReview({ ...newReview, stars: parseInt(event.target.value) });
  };

  const handleCommentChange = (event) => {
    setNewReview({ ...newReview, comment: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    newReview.date = new Date().toJSON();

    try {
      await axios.put('/reviews/add', newReview);
      setReviews([newReview, ...reviews]);
      setNewReview(initialReview);
      toast.success('Added review successfully');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Box>
      {!isLoading && (
        <Box sx={{ bgcolor: 'background.paper' }}>
          <CssBaseline />
          <Typography component="h1" variant="h5" textAlign="center" marginBottom="20px">
            Reviews
          </Typography>
          <List dense>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              <ListItem key={-1} sx={{ width: 'auto', marginBottom: '8px' }}>
                <Card sx={{ width: 400, height: 210 }} component="form" onSubmit={handleSubmit}>
                  <CardContent>
                    <Rating
                      name="stars"
                      value={newReview.stars}
                      onChange={handleStarsChange}
                      required
                      sx={{ marginBottom: '20px' }}
                    />
                    <TextField
                      required
                      autoFocus
                      fullWidth
                      type="text"
                      autoComplete="off"
                      label="Comment"
                      name="comment"
                      value={newReview.comment}
                      multiline={true}
                      rows={2}
                      onChange={handleCommentChange}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      sx={{ mt: 3, mb: 2 }}
                      size="small"
                      variant="contained">
                      Add review
                    </Button>
                  </CardContent>
                </Card>
              </ListItem>
              {reviews.map((review) => {
                return (
                  <ListItem key={review.comment} sx={{ width: 'auto', marginBottom: '8px' }}>
                    <Card sx={{ width: 350 }}>
                      <CardContent>
                        <Rating
                          value={review.stars}
                          readOnly={true}
                          sx={{ marginBottom: '10px' }}
                        />
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {review.comment}
                        </Typography>
                        <Typography variant="body2">
                          {moment(new Date(review.date)).format('DD-MM-YYYY')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                );
              })}
            </Grid>
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Reviews;
