import { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import {
  CreateWalletPayload,
  CreateWalletResponse,
  FinalizeWalletPayload,
  FinalizeWalletResponse,
  FetchWalletsResponse,
  FetchWalletDetailsPayload,
  FetchWalletDetailsResponse,
  GetOutputsPayload,
  GetOutputsResponse,
  FetchWalletTransactionsResponse,
  ShareWalletPayload,
  ShareWalletResponse,
  RemoveWalletAccessResponse,
  RemoveWalletAccessPayload,
  CreateUnsignedTransactionPayload,
  CreateUnsignedTransactionResponse,
  SubmitTransactionPayload,
  SubmitTransactionResponse,
  FetchTransactionDetailsPayload,
  FetchTransactionDetailsResponse,
  UpdateWalletDetailsPayload,
  UpdateWalletDetailsResponse,
  DeleteWalletResponse,
  DeleteWalletPayload,
  ListRequestParams,
  FetchSubaddressResponse,
  SyncMultisigPayload,
  SyncMultisigResponse,
  UpdateTransactionDetailsResponse,
  UpdateTransactionDetailsPayload,
  PersistWalletPayload,
  Subaddress,
  SubaddressResponse,
  AddSubaddressSignaturePayload,
  RequestWalletSharePayload,
  FetchWalletShareRequestsResponse,
  UpdateSubaddressPayload,
  FetchWalletMembersResponse,
  FetchPendingTranfersResponse,
  PendingTransferApprovalPayload,
} from "../types";

export class WalletsApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public createWallet(data: CreateWalletPayload): Promise<CreateWalletResponse> {
    return this.post<CreateWalletResponse, CreateWalletPayload>("/wallets/", data)
      .then(this.success);
  }

  public finalizeWallet(id: string, data: FinalizeWalletPayload): Promise<FinalizeWalletResponse> {
    return this.post<FinalizeWalletResponse, FinalizeWalletPayload>(`/wallets/${id}/finalize/`, data)
      .then(this.success);
  }

  public fetchWallets(params: ListRequestParams): Promise<FetchWalletsResponse> {
    // We're not interested in listing wallets that are not in FINALIZED state
    return this.get<FetchWalletsResponse>("/wallets/", { params: { ...params, status: "FINALIZED" } })
      .then(this.success);
  }

  public fetchWalletDetails(data: FetchWalletDetailsPayload): Promise<FetchWalletDetailsResponse> {
    return this.get<FetchWalletDetailsResponse>(`/wallets/${data.id}/`)
      .then(this.success);
  }

  public updateWalletDetails(data: UpdateWalletDetailsPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<UpdateWalletDetailsResponse> {
    return this.patch<UpdateWalletDetailsResponse, UpdateWalletDetailsPayload>(`/wallets/${data.id}/`, data, config)
      .then(this.success);
  }

  public deleteWallet(data: DeleteWalletPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<DeleteWalletResponse> {
    return this.delete<DeleteWalletResponse>(`/wallets/${data.id}/`, config)
      .then(this.success);
  }

  public getOutputs(data: GetOutputsPayload): Promise<GetOutputsResponse> {
    return this.post<GetOutputsResponse, GetOutputsPayload>(`/wallets/${data.id}/get_outputs/`)
      .then(this.success);
  }

  public syncMultisig(data: SyncMultisigPayload): Promise<SyncMultisigResponse> {
    return this.post<SyncMultisigResponse, SyncMultisigPayload>(`/wallets/${data.id}/sync_multisig/`, data)
      .then(this.success);
  }

  public persistWallet(id: string, data: PersistWalletPayload): Promise<null> {
    return this.post<null, PersistWalletPayload>(`/wallets/${id}/persist/`, data)
      .then(this.success);
  }

  public fetchWalletTransactions(walletId: string, params: ListRequestParams): Promise<FetchWalletTransactionsResponse> {
    return this.get<FetchWalletTransactionsResponse>(`/wallets/${walletId}/transactions/`, { params })
      .then(this.success);
  }

  public fetchTransactionDetails(data: FetchTransactionDetailsPayload): Promise<FetchTransactionDetailsResponse> {
    return this.get<FetchTransactionDetailsResponse>(`/wallets/${data.walletId}/transactions/${data.transactionId}/`)
      .then(this.success);
  }

  public updateTransactionDetails(data: UpdateTransactionDetailsPayload): Promise<UpdateTransactionDetailsResponse> {
    return this.patch<UpdateTransactionDetailsResponse, UpdateTransactionDetailsPayload>(`/wallets/${data.walletId}/transactions/${data.transactionId}/`, data)
      .then(this.success);
  }

  public requestWalletShare(id: string, data: RequestWalletSharePayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<Record<string, never>> {
    return this.post<Record<string, never>, RequestWalletSharePayload>(`/wallets/${id}/share/share/`, data, config)
      .then(this.success);
  }

  public shareWallet(id: string, data: ShareWalletPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<ShareWalletResponse> {
    return this.post<ShareWalletResponse, ShareWalletPayload>(`/wallets/${id}/members/`, data, config)
      .then(this.success);
  }

  public updateWalletAccess(walletId: string, membershipId: string, data: ShareWalletPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<ShareWalletResponse> {
    return this.put<ShareWalletResponse, ShareWalletPayload>(`/wallets/${walletId}/members/${membershipId}/`, data, config)
      .then(this.success);
  }

  public removeWalletAccess(data: RemoveWalletAccessPayload): Promise<RemoveWalletAccessResponse> {
    return this.delete<RemoveWalletAccessResponse>(`/wallets/${data.walletId}/members/${data.userId}/`)
      .then(this.success);
  }

  public createUnsignedTransaction(id: string, data: CreateUnsignedTransactionPayload): Promise<CreateUnsignedTransactionResponse> {
    return this.post<CreateUnsignedTransactionResponse, CreateUnsignedTransactionPayload>(`/wallets/${id}/transactions/`, data)
      .then(this.success);
  }

  public submitTransaction(id: string, data: SubmitTransactionPayload, config?: { headers: { "X-RINO-2FA": string } }): Promise<SubmitTransactionResponse> {
    return this.post<SubmitTransactionResponse, SubmitTransactionPayload>(`/wallets/${id}/transactions/submit/`, data, config)
      .then(this.success);
  }

  public createSubaddress(id: string): Promise<SubaddressResponse> {
    return this.post<Subaddress, void>(`/wallets/${id}/subaddresses/`)
      .then(this.success);
  }

  public addSubaddressSignature(id: string, address: string, data: AddSubaddressSignaturePayload): Promise<SubaddressResponse> {
    return this.post<Subaddress, AddSubaddressSignaturePayload>(`/wallets/${id}/subaddresses/${address}/sign/`, data)
      .then(this.success);
  }

  public fetchWalletSubaddresses(walletId: string, params: ListRequestParams): Promise<FetchSubaddressResponse> {
    return this.get<FetchSubaddressResponse>(`/wallets/${walletId}/subaddresses/`, { params })
      .then(this.success);
  }

  public fetchWalletShareRequests(walletId: string, params: ListRequestParams): Promise<FetchWalletShareRequestsResponse> {
    return this.get<FetchWalletShareRequestsResponse>(`/wallets/${walletId}/share/`, { params })
      .then(this.success);
  }

  public updateWalletSubaddresses(id: string, address: string, data: UpdateSubaddressPayload): Promise<SubaddressResponse> {
    return this.put<Subaddress, UpdateSubaddressPayload>(`/wallets/${id}/subaddresses/${address}/`, data)
      .then(this.success);
  }

  public fetchRevokedMembers(walletId: string, params: ListRequestParams): Promise<FetchWalletMembersResponse> {
    return this.get<FetchWalletMembersResponse>(`/wallets/${walletId}/removed_spenders/`, { params })
      .then(this.success);
  }

  public fetchWalletMembers(walletId: string, params: ListRequestParams): Promise<FetchWalletMembersResponse> {
    return this.get<FetchWalletMembersResponse>(`/wallets/${walletId}/members/`, { params })
      .then(this.success);
  }

  public fetchPendingTransfers(walletId: string, params: ListRequestParams & { status__in?: number[], status?: number }): Promise<FetchPendingTranfersResponse> {
    return this.get<FetchPendingTranfersResponse>(`/wallets/${walletId}/pending_transfers/`, { params })
      .then(this.success);
  }

  public approvePendingTransfer(data: PendingTransferApprovalPayload): Promise<FinalizeWalletResponse> {
    return this.post<FinalizeWalletResponse, PendingTransferApprovalPayload>(`/wallets/${data.walletId}/pending_transfers/${data.transactionId}/approve/`)
      .then(this.success);
  }

  public rejectPendingTransfer(data: PendingTransferApprovalPayload): Promise<FinalizeWalletResponse> {
    return this.post<FinalizeWalletResponse, PendingTransferApprovalPayload>(`/wallets/${data.walletId}/pending_transfers/${data.transactionId}/reject/`)
      .then(this.success);
  }

  public cancelPendingTransfer(data: PendingTransferApprovalPayload): Promise<FinalizeWalletResponse> {
    return this.post<FinalizeWalletResponse, PendingTransferApprovalPayload>(`/wallets/${data.walletId}/pending_transfers/${data.transactionId}/cancel/`)
      .then(this.success);
  }
}

const walletsApi = new WalletsApi(apiConfig);

export default walletsApi;
