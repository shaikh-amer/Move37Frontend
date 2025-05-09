import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import sceneReducer from "./screenSlice";
import displayItems from "./textSlice";
import { newApi } from "./newApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [newApi.reducerPath]: newApi.reducer,
    sceneSettings: sceneReducer,
    reduxScene: displayItems,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware, newApi.middleware),
  // devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
