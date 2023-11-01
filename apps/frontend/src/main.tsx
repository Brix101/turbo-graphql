import { ApolloProvider } from "@apollo/client";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.css";
import apolloClient from "./utils/apollo-client";

const el = document.getElementById("root");
if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find root element");
}
