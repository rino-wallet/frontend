import {TypedUseSelectorHook, useSelector as _useSelector} from "react-redux";
import type {RootState} from "../types";

/**
 * Typed versions of the useSelector. Use throughout the app instead of plain `useSelector` from the "react-redux". 
 */
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
