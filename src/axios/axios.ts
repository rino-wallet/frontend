import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class Axios {
  public axios: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.axios = axios.create(config);
  }
}
