import {useDispatch as _useDispatch} from "react-redux";
import {store} from "../store";

/**
 * Typed versions of the useDispatch. Use throughout the app instead of plain `useDispatch` from the "react-redux". 
 */
// eslint-disable-next-line
export const useDispatch = () => _useDispatch<typeof store.dispatch>();
