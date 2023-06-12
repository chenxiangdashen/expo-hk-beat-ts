import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEY } from "@/enums/cacheEnum";

interface UserInfoState {
  token: string | null;
}

const initialState: UserInfoState = {
  token: null,
} as UserInfoState;

export const UserInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    qryUserInfo: (state) => {},
    // 用户存储 token
    setToken: (state, action: PayloadAction<string>) => {
      SecureStore.setItemAsync(TOKEN_KEY, action.payload);
      state.token = action.payload;
    },
    removeToken: (state) => {
      SecureStore.deleteItemAsync(TOKEN_KEY);
      state.token = null;
    },
    resetToken: (state) => {
      SecureStore.deleteItemAsync(TOKEN_KEY);
      state.token = null;
    },
  },
});

export const { setToken, removeToken, resetToken } = UserInfoSlice.actions;

export const selectToken = (state: RootState) => state.userInfo.token;

export default UserInfoSlice.reducer;
