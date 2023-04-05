import axios from 'axios';

const tesloApi = axios.create({
  //crear constante en la url
  baseURL: '/api',
});

export default tesloApi;
