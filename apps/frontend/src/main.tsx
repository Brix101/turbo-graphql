import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { jwtDecode } from "jwt-decode";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { getAccessToken, setAccessToken } from "./accessToken";
import App from "./app";
import "./index.css";

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        return new Promise<boolean>((resolve) => {
          const token = getAccessToken();

          if (!token) {
            resolve(true);
          }

          try {
            const { exp } = jwtDecode(token);
            const expData = exp ?? 0;
            if (Date.now() >= expData * 1000) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch {
            resolve(false);
          }
        });
      },
      fetchAccessToken: () => {
        return fetch("http://192.168.254.117:3000/refresh_token", {
          method: "GET",
          credentials: "include",
        });
      },
      handleFetch: (accessToken) => {
        console.log(accessToken);
        setAccessToken(accessToken);
      },
      handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      },
    }),
    // onError(({ graphQLErrors, networkError }) => {
    //   console.log(graphQLErrors);
    //   console.log(networkError);
    // }),
    requestLink,
    new HttpLink({
      uri: "http://192.168.254.117:3000/graphql",
      credentials: "include",
    }),
  ]),
  cache,
});

const el = document.getElementById("root");
if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
} else {
  throw new Error("Could not find root element");
}
