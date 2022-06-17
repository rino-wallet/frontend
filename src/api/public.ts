import { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import {
  ListRequestParams,
  FetchTransactionDetailsResponse,
  FetchWalletTransactionsResponse,
  FetchSubaddressResponse,
  FetchPublicWalletDetailsResponse,
  FetchPublicWalletTransactionDetailsPayload,
} from "../types";

export class PublicApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public fetchPublicWalletDetails(publicSlug: string): Promise<FetchPublicWalletDetailsResponse> {
    return this.get<FetchPublicWalletDetailsResponse>(`/public/wallets/${publicSlug}/`).then(this.success);
  }

  public fetchPublicWalletTransactions(publicSlug: string, params: ListRequestParams): Promise<FetchWalletTransactionsResponse> {
    return this.get<FetchWalletTransactionsResponse>(`/public/wallets/${publicSlug}/transactions/`, { params })
      .then(this.success);
  }

  public fetchTransactionDetails(data: FetchPublicWalletTransactionDetailsPayload): Promise<FetchTransactionDetailsResponse> {
    return this.get<FetchTransactionDetailsResponse>(`/public/wallets/${data.publicSlug}/transactions/${data.transactionId}/`)
      .then(this.success);
  }

  public fetchPublicWalletSubaddresses(publicSlug: string, params: ListRequestParams): Promise<FetchSubaddressResponse> {
    return this.get<FetchSubaddressResponse>(`/public/wallets/${publicSlug}/subaddresses/`, { params })
      .then(this.success);
  }
}

const publicApi = new PublicApi(apiConfig);

export default publicApi;
