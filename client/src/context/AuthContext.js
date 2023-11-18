import { createContext } from "react";
//Do not change this code
function noop() {}
export const AuthContext = createContext({
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
});
