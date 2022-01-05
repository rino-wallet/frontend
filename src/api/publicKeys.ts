import { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import { FetchPublicKeyPayload, FetchPublicKeyResponse } from "../types";

export class PublicKeysApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public fetchPublicKey(params: FetchPublicKeyPayload): Promise<FetchPublicKeyResponse> {
    return this.get<FetchPublicKeyResponse>("/public-keys/", { params }).then(this.success);
  }
}

const publicKeysApi = new PublicKeysApi(apiConfig);

export default publicKeysApi;
