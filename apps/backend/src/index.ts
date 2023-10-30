import { log } from "logger";
import { createServer } from "./server";

const port = (process.env.PORT || 5000) as number;

createServer().then((server) =>
  server.listen(port, "0.0.0.0", () => {
    log(`api running on ${port}`);
  })
);
