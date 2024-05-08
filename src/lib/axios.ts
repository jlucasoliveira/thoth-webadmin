import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { API_URL } from '@/config';
import { storage } from '@/utils/storage';
import { useNotificationStore } from '@/stores/notifications';
import { useUserStore } from '@/stores/user';

/**
 * @description https://github.com/axios/axios/issues/5573#issuecomment-1489596178
 */
interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

function authRequestInterceptor(config: AdaptAxiosRequestConfig): AdaptAxiosRequestConfig {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

const axios = Axios.create({
  baseURL: API_URL,
});

function handleResponseErrorsNotification(messages: string[]) {
  useNotificationStore.getState().addNotificationBatch(
    messages.map((message) => ({
      type: 'error',
      title: 'Ops!!!',
      message,
    }))
  );
}

function handleUnAuthorizedError() {
  storage.clearToken();
  useUserStore.getState().removeToken();
  useUserStore.getState().removeUserData();
  handleResponseErrorsNotification(['Sua sessão expirou! Por favor, entre novamente.']);
}

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string | string[] = error.response?.data?.message || error.message;

    if (error?.response?.status !== 401) {
      handleResponseErrorsNotification(Array.isArray(message) ? message : [message]);
      return Promise.reject(error);
    }

    handleUnAuthorizedError();
  }
);

export { axios };
