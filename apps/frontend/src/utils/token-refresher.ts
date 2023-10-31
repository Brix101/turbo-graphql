import { TokenRefreshLink } from "apollo-link-token-refresh";
import { jwtDecode } from "jwt-decode";

let accessToken = "";

export const getAccessToken = (): string => {
  return accessToken;
};

const refresher = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    return new Promise<boolean>((resolve) => {
      try {
        const { exp } = jwtDecode(accessToken);
        const expData = exp ?? 0;
        const isTokenValid = Date.now() < expData * 1000; // check if the token is still valid
        resolve(isTokenValid);
      } catch (error) {
        resolve(false);
      }
    });
  },
  fetchAccessToken: () => {
    return fetch("/api/refresh_token", {
      credentials: "include",
    });
  },
  handleFetch: (restoken) => {
    accessToken = restoken;
  },
});

export default refresher;
