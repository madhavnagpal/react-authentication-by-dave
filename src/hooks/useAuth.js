import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const authContext = useContext(AuthContext);
  const { auth } = authContext;
  useDebugValue(auth, (auth) => (auth?.user ? "Logged In" : "Logged Out"));
  return authContext;
};

export default useAuth;
