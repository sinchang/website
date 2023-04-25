import axios from "axios";
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {'X-Language': 'foobar'}
})


export const request = async <D, R>(options: AxiosRequestConfig<D>) => {
  const onSuccess = (response: AxiosResponse<R>) => {
    return response.data
  };

  const onError =  (error: AxiosError) => {
    return Promise.reject(error.response);
  };

  return instance(options).then(onSuccess).catch(onError);
};

