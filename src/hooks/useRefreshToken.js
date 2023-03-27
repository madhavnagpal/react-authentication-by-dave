import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true, // allows to send cookies with our request
    });
    setAuth((prev) => {
      console.log(
        JSON.stringify(prev),
        " prev state of auth - in useRefreshToken"
      );
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
}

export default useRefreshToken;
