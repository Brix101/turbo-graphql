import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import { readFileSync } from "fs";
import gql from "graphql-tag";
import morgan from "morgan";
import resolvers from "./resolvers";

export const createServer = async (): Promise<Express> => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/", (_, res) => {
      return res.redirect("/graphql");
    });

  const typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await server.start();
  // Specify the path to mount the server
  app.use("/graphql", cors(), json(), expressMiddleware(server));

  return app;
};
