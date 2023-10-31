import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.css";
import refresher, { getAccessToken } from "./utils/token-refresher";

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${accessToken}`,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([refresher, authMiddleware, httpLink]),
});

const el = document.getElementById("root");
if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find root element");
}
