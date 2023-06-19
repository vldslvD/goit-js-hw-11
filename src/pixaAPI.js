const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';

export async function getPictures(query, pageCount) {
  const options = {
    params: {
      key: '18437438-e84daa7a60435ecf6da817657',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: pageCount,
    },
  };
  query = query.replace(/ /g, '+');
  const response = await axios.get(`${BASE_URL}?q=${query}`, options);
  
  return response;
}
