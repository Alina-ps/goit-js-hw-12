import axios from 'axios';

export const searchImages = async (q, page = 1, per_page = 15) => {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = new URLSearchParams({
    key: '44002996-fc99192b9f50d4483edb9d78f',
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page,
  });

  const response = await axios.get(`${BASE_URL}?${params.toString()}`);
  return response.data;
};
