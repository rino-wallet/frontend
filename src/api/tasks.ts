import { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { Api } from "../axios/api";

export class TasksApi extends Api {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  public checkTask<Response>(taskId: string): Promise<Response> {
    return this.get<Response>(`/tasks/${taskId}/`).then(this.success);
  }
}

const tasksApi = new TasksApi(apiConfig);

export default tasksApi;
