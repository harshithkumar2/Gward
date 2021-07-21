import { createSlice } from "@reduxjs/toolkit";

const Users = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : null;

const Tokens = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;

const initialState = {
  users: Users,
  token: Tokens,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoginDetails: (state, action) => {
      state.users = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("users", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
    },
    logoutSuccess: (state, action) => {
      state.users = null;
      state.token = null;
      localStorage.removeItem("users");
      localStorage.removeItem("token");
    },
  },
});

export const { setLoginDetails, logoutSuccess } = userSlice.actions;
export const getUsers = (state) => state.user.users;
export const getToken = (state) => state.user.token;
export default userSlice.reducer;
