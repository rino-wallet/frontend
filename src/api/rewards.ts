import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import camelcaseKeys from "camelcase-keys";
import { apiConfig } from "./config";
import { Api } from "../axios/api";
import { ListRequestParams } from "../types";

export class RewardsApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public getReferrals(params: ListRequestParams): Promise<any> {
    return this.get<any>(
      "/rewards/referrals/",
      { params },
    ).then(this.success);
  }

  public getOwnReferral(): Promise<any> {
    return this.get<any>(
      "/rewards/referrals/own/",
    ).then(this.success);
  }

  public getReferral(params: { id: string }): Promise<any> {
    return this.get<any>(
      `/rewards/referrals/${params.id}`,
    ).then(this.success);
  }

  public claimReferral(id: string, payload: { address: string }): Promise<any> {
    return this.post<any, any>(
      `/rewards/referrals/${id}/claim/`,
      payload,
    ).then(this.success);
  }

  public getPromotions(params: ListRequestParams): Promise<any> {
    return this.get<any>(
      "/rewards/promotions/",
      { params },
    ).then(this.success);
  }

  public getPromotion(params: { id: string }): Promise<any> {
    return this.get<any>(
      `/rewards/promotions/${params.id}`,
    ).then(this.success);
  }

  public claimPromotion(id: string, payload: { address: string }): Promise<any> {
    return this.post<any, any>(
      `/rewards/promotions/${id}/claim/`,
      payload,
    ).then(this.success);
  }

  public addPromotion(payload: { code: string }): Promise<any> {
    return this.post<any, any>(
      "/rewards/promotions/",
      payload,
    ).then(this.success);
  }

  public getReferralsStats(): Promise<any> {
    return this.get<any>(
      "/rewards/referrals/stats/",
    ).then(this.success);
  }

  public getPromotionsStats(): Promise<any> {
    return this.get<any>(
      "/rewards/promotions/stats/",
    ).then(this.success);
  }
}

const rewardsApi = new RewardsApi(apiConfig);

if (process.env.REACT_APP_ENABLE_API_MOCKS === "true") {
  const axiosMockAdapterInstance = new MockAdapter(rewardsApi.axios, { delayResponse: 1000 });

  axiosMockAdapterInstance
    // eslint-disable-next-line
    .onGet(new RegExp("/rewards/referrals/"))
    .reply(() => [201, camelcaseKeys([
      {
        id: "id-1",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Pending",
        referee_addr: "address",
        reward: 12738042162,
      },
      {
        id: "id-2",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Ready",
        referee_addr: "address",
        reward: 12738042162,
      },
      {
        id: "id-3",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Ready",
        referee_addr: "",
        reward: 12738042162,
      },
      {
        id: "id-4",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Paid",
        referee_addr: "",
        reward: 12738042162,
      },
      {
        id: "id-5",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Paid",
        referee_addr: "",
        reward: 12738042162,
      },
    ]),
    ]);
  axiosMockAdapterInstance
    // eslint-disable-next-line
    .onGet(new RegExp("/rewards/promotions/"))
    .reply(() => [201, camelcaseKeys([
      {
        id: "id-1",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Pending",
        referee_addr: "address",
        reward: 12738042162,
      },
      {
        id: "id-2",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Ready",
        referee_addr: "address",
        reward: 12738042162,
      },
      {
        id: "id-3",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Ready",
        referee_addr: "",
        reward: 12738042162,
      },
      {
        id: "id-4",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Paid",
        referee_addr: "",
        reward: 12738042162,
      },
      {
        id: "id-5",
        referee: "referee1@gmail.com",
        referrer: "referrer@gmail.com",
        referee_status: "Paid",
        referee_addr: "",
        reward: 12738042162,
      },
    ]),
    ]);
  axiosMockAdapterInstance
    // eslint-disable-next-line
    .onGet(new RegExp("/rewards/referrals/:id"))
    .reply(() => [201, {},
    ]);
}

export default rewardsApi;
