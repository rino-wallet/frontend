import { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import {
  SignUpResponse,
  SignUpPayload,
  ConfirmEmailPayload,
  ResetPasswordRequestPayload,
  ResetPasswordConfirmPayload,
  SignInPayload,
  SignInResponse,
  SetUpKeyPairPayload,
  SetUpKeyPairResponse,
  UserResponse,
  FetchBackupPrivateKeyPayload,
  FetchBackupPrivateKeyResponse,
  ChangePasswordPayload,
  ChangeEmailRequestPayload,
  ChangingEmailInfoPayload,
  ChangingEmailInfoResponse,
  ChangeEmailConfirmPayload,
  UpdateUserPayload,
  AcceptWalletSharePayload,
  ResendActivationEmailPayload,
  ListRequestParams,
  FetchAccountActivityResponse,
} from "../types";

export class SessionApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public signUp(data: SignUpPayload): Promise<SignUpResponse> {
    return this.post<SignUpResponse, SignUpPayload>("/accounts/", data).then(this.success);
  }

  public signIn(
    credentials: SignInPayload,
    config?: { headers: { "X-RINO-2FA": string } },
  ): Promise<AxiosResponse<SignInResponse>> {
    return this.post<SignInResponse, SignInPayload>(
      "/auth/login/",
      credentials,
      config,
    );
  }

  public verifyPassword(
    credentials: SignInPayload,
  ): Promise<AxiosResponse<SignInResponse>> {
    return this.post<SignInResponse, SignInPayload>(
      "/auth/login/",
      credentials,
      {
        headers: {},
      },
    );
  }

  public signOut(): Promise<void> {
    return this.post<void, void>("/auth/logout/").then(this.success);
  }

  public signOutAll(): Promise<void> {
    return this.post<void, void>("/auth/logoutall/").then(this.success);
  }

  public resetPasswordRequest(
    data: ResetPasswordRequestPayload,
  ): Promise<void> {
    return this.post<void, ResetPasswordRequestPayload>(
      "/accounts/reset_password/",
      data,
    ).then((response) => this.success<void>(response));
  }

  public resendActivationEmail(
    data: ResendActivationEmailPayload,
  ): Promise<void> {
    return this.post<void, ResendActivationEmailPayload>(
      "/accounts/resend_activation/",
      data,
    ).then((response) => this.success<void>(response));
  }

  public resetPasswordConfirm(
    data: ResetPasswordConfirmPayload,
  ): Promise<void> {
    return this.post<void, ResetPasswordConfirmPayload>(
      "/accounts/reset_password_confirm/",
      data,
    ).then(this.success);
  }

  public confirmEmail(data: ConfirmEmailPayload): Promise<void> {
    return this.post<void, ConfirmEmailPayload>(
      "/accounts/activation/",
      data,
    ).then(this.success);
  }

  public setupKeyPair(data: SetUpKeyPairPayload): Promise<SetUpKeyPairResponse> {
    return this.post<SetUpKeyPairResponse, SetUpKeyPairPayload>(
      "/accounts/keypair/",
      data,
    ).then(this.success);
  }

  public fetchBackupPrivateKey({ uid, token }: FetchBackupPrivateKeyPayload): Promise<FetchBackupPrivateKeyResponse> {
    return this.get<FetchBackupPrivateKeyResponse>(
      `/accounts/${uid}/reset-password/${token}/`,
    ).then(this.success);
  }

  public getCurrentUser(): Promise<UserResponse> {
    return this.get<UserResponse>(
      "/accounts/me/",
    ).then(this.success);
  }

  public updateUser(data: UpdateUserPayload): Promise<UserResponse> {
    return this.patch<UserResponse, UpdateUserPayload>(
      "/accounts/me/",
      data,
    ).then(this.success);
  }

  public changePassword(data: ChangePasswordPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<void> {
    return this.post<void, ChangePasswordPayload>(
      "/accounts/set_password/",
      data,
      config,
    ).then(this.success);
  }

  public changeEmailRequest(data: ChangeEmailRequestPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<void> {
    return this.post<void, ChangeEmailRequestPayload>(
      "/accounts/email-changes/",
      data,
      config,
    ).then(this.success);
  }

  public getEmailChangingInfo(data: ChangingEmailInfoPayload): Promise<ChangingEmailInfoResponse> {
    return this.get<ChangingEmailInfoResponse>(
      `/accounts/email-changes/${data.token}/`,
    ).then(this.success);
  }

  public confirmEmailChanging(data: ChangeEmailConfirmPayload): Promise<void> {
    return this.post<void, void>(
      `/accounts/email-changes/${data.token}/confirm/`,
    ).then(this.success);
  }

  public acceptWalletShare({ walletId, shareId }: AcceptWalletSharePayload): Promise<void> {
    return this.post<void, ConfirmEmailPayload>(
      `/wallets/${walletId}/share/${shareId}/accept_share/`,
    ).then(this.success);
  }

  public getAccountActivity(params: ListRequestParams): Promise<FetchAccountActivityResponse> {
    return this.get<FetchAccountActivityResponse>(
      "/accounts/me/activity",
      { params },
    ).then(this.success);
  }
}

const seessionApi = new SessionApi(apiConfig);

export default seessionApi;
