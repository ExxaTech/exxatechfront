import axios from 'axios';
import { Environtment } from '../../../environment';
import { errorInterceptor, responseInterceptor } from './interceptors';

const Api = axios.create({
  baseURL: Environtment.URL_BASE,
});

const ApiViaCep = axios.create({
  baseURL: Environtment.URL_VIA_CEP
})

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export { Api, ApiViaCep };
