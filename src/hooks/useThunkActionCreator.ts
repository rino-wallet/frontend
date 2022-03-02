import {unwrapResult, AsyncThunk} from "@reduxjs/toolkit";
import { ApiError, UseThunkActionCreator } from "../types";
 import { useDispatch } from "./useDispatch";

/**
 * React hook useThunkActionCreator simplifies the process of dispatching of a thunk.
 *  
 * @param {object} asyncThunkAction - thunk created with help of `createAsyncThunk`.
 * @returns {function} actionExecutor - this function can be called inside a react component in order to dispatch the action.
 * This function accepts a single argument, which will be passed as action payload to the thunk
 */
export const useThunkActionCreator = <Response, Payload>(asyncThunkAction: AsyncThunk<Response, Payload, Record<string, unknown>>): (data: Payload) => UseThunkActionCreator<Response> => {
  const dispatch = useDispatch();
  return (data: Payload): UseThunkActionCreator<Response> => {
    const dispatchResult: any = dispatch(asyncThunkAction(data));
    const promise: any = new Promise((reolve, reject) => {
      dispatchResult.then(unwrapResult)
      .then((response: Response) => reolve(response))
      .catch((error: Promise<ApiError>) => reject(error))
    });
    promise.abort = dispatchResult.abort;
    return promise;
  }
}

