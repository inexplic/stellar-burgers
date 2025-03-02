import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerConstructorSlice from './slices/burgerConstructorSlice';
import ingredientsSlice from './slices/ingredientsSlice';
import feedSlice from './slices/feedSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorSlice,
  ingredients: ingredientsSlice,
  feed: feedSlice,
  auth: authReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
