import { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import {
  CreateZammadTicketPayload,
} from "../types";

export class ZammadApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public createTicket(
    payload: CreateZammadTicketPayload,
  ): Promise<AxiosResponse<any>> {
    return this.post<any, CreateZammadTicketPayload>(
      "/support/tickets/",
      payload,
    );
  }
}

const zammadApi = new ZammadApi(apiConfig);

export default zammadApi;
