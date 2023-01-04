import { toast } from 'react-toastify';

export const handleError = (error) => {
  if (error?.response?.data) {
    toast.error(error.response?.data || error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
};
