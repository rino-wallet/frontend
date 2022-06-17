import tasksApi from "../api/tasks";
import { TaskStatus } from "../types";

/**
 * This function will poll the server every 10 seconds until the task complete
 * @param  {string} id
 * @param signal
 * @returns Promise
 */
export default function pollTask(id: string, signal: AbortSignal | null = null): Promise<any> {
  return new Promise((resolve, reject) => {
    let aborted = false;
    signal?.addEventListener("abort", () => {
      // eslint-disable-next-line
      console.log("Polling aborted.");
      aborted = true;
      return reject(signal);
    });
    let timeoutID: any;
    async function fetchData(_timeoutID?: any): Promise<void> {
      try {
        if (aborted) {
          reject({ data: { message: "ABORTED" } });
          return;
        }
        const resp = await tasksApi.checkTask<{ status: TaskStatus, result: any }>(id);
        if (resp.status === "COMPLETED") {
          resolve(resp);
          if (_timeoutID) {
            clearInterval(_timeoutID);
          }
        } else if (resp.status === "FAILED") {
          reject({ data: { message: resp.result } });
          if (_timeoutID) {
            clearInterval(_timeoutID);
          }
        } else {
          timeoutID = setTimeout(async () => {
            fetchData(timeoutID);
          }, 10000);
        }
      } catch (error) {
        setTimeout(fetchData, 10000);
      }
    }
    fetchData();
  });
}
