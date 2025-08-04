import React from "react";

const AuthContext = React.createContext({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
});

export default AuthContext;
