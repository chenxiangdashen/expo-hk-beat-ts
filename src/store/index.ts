import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/CounterSlice";
import UserInfoSlice from "./features/auth/UserInfoSlice";

const store = configureStore({
  reducer: {
      counter: counterReducer,
      userInfo: UserInfoSlice,
  },
});

export default store;

 // 从 store 本身推断 RootStore 和 AppDispatch 的类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
