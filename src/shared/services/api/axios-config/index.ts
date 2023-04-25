import axios from 'axios';
import { Environtment } from '../../../environment';
import { errorInterceptor, responseInterceptor } from './interceptors';

const Api = axios.create({
  baseURL: Environtment.BASE_URL,
  headers: {
    // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('APP_ACCESS_TOKEN') || '')}`
  }
});

const ApiViaCep = axios.create({
  baseURL: Environtment.URL_VIA_CEP,
  headers: {
    'Access-Control-Allow-Origin': 'https://exxatech.com;br'
  }
})

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export { Api, ApiViaCep };
