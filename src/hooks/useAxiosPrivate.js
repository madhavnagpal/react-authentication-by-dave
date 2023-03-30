import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // for first time when authorization header is not set
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;
        if (error?.response?.status === 403 && !previousRequest?.sent) {
          // 403 - forbidden due to access token expiration
          previousRequest.sent = true;
          const newAccessToken = await refresh();
          previousRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(previousRequest); // what if we dont come in request due to sent the how are we retrying ??
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
}

export default useAxiosPrivate;
