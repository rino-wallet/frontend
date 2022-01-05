import {unwrapResult, AsyncThunk} from "@reduxjs/toolkit";
import { useDispatch } from "./useDispatch";

/**
 * React hook useThunkActionCreator simplifies the process of dispatching of a thunk.
 *  
 * @param {object} asyncThunkAction - thunk created with help of `createAsyncThunk`.
 * @returns {function} actionExecutor - this function can be called inside a react component in order to dispatch the action.
 * This function accepts a single argument, which will be passed as action payload to the thunk
 */
export const useThunkActionCreator = <Response, Payload>(asyncThunkAction: AsyncThunk<Response, Payload, Record<string, unknown>>): (data: Payload) => Promise<Response> => {
  const dispatch = useDispatch();
  return (data: Payload): Promise<Response> => new Promise((reolve, reject) => {
    dispatch(asyncThunkAction(data))
    .then(unwrapResult)
    .then((response: Response) => reolve(response))
    .catch((error: any) => reject(error))
  })
}

