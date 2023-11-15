import { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import {
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  FetchApiKeysResponse,
  ListRequestParams,
} from "../types";

export class APIKeysApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public createApiKey(
    data: CreateApiKeyPayload,
    config?: { headers: { "X-RINO-2FA": string } },
  ): Promise<CreateApiKeyResponse> {
    return this.post<CreateApiKeyResponse, CreateApiKeyPayload>(
      "/api-keys/",
      data,
      config,
    )
      .then(this.success);
  }

  public fetchApiKeys(params: ListRequestParams): Promise<FetchApiKeysResponse> {
    return this.get<FetchApiKeysResponse>("/api-keys/", { params })
      .then(this.success);
  }

  public deleteApiKey(
    id: string,
    config?: { headers: { "X-RINO-2FA": string } },
  ) {
    return this.delete(`/api-keys/${id}`, config)
      .then(this.success);
  }
}

const apiKeysApi = new APIKeysApi(apiConfig);

export default apiKeysApi;
