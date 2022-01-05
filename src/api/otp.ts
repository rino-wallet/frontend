import { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import {
  Create2FAResponse,
  Enable2FAPayload,
  Enable2FAResponse,
  Delete2FAPayload,
} from "../types";

export class OTPApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public create2FA(): Promise<Create2FAResponse> {
    return this.post<Create2FAResponse, void>("/otps/").then(this.success);
  }

  public enable2FA(
    data: Enable2FAPayload
  ): Promise<Enable2FAResponse> {
    return this.post<Enable2FAResponse, Enable2FAPayload>(
      "/otps/enable/",
      data
    ).then(this.success);
  }

  public delete2FA(data: Delete2FAPayload): Promise<void> {
    return this.delete<void>("/otps/disable/", {
      headers: { "X-RINO-2FA": data.code },
    }).then(this.success);
  }
}

export default new OTPApi(apiConfig);
