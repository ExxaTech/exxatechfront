import axios from 'axios';
import { Environment } from '../../../environment';
import { errorInterceptor, responseInterceptor } from './interceptors';

const Api = axios.create({
  baseURL: Environment.BASE_URL,
  headers: {
    // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('APP_ACCESS_TOKEN') || '')}`
  }
});

const ApiViaCep = axios.create({
  baseURL: Environment.URL_VIA_CEP,
  headers: {
    'Access-Control-Allow-Origin': 'https://exxatech.com;br'
  }
})

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export { Api, ApiViaCep };
