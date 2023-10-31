import * as React from "react";
import { CounterButton, Link } from "ui";
import { setAccessToken } from "../accessToken";
import Test from "./Test";
import "./styles.css";

function App(): JSX.Element {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/refresh_token", {
      method: "GET",
      credentials: "include",
    }).then(async (x) => {
      try {
        const { accessToken } = await x.json();
        setAccessToken(accessToken);
      } catch (err) {}
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="container">
      <Test />
      <h1 className="title">
        Admin <br />
        <span>Kitchen Sink</span>
      </h1>
      <CounterButton />
      <p className="description">
        Built With{" "}
        <Link href="https://turbo.build/repo" newTab>
          Turborepo
        </Link>
        {" & "}
        <Link href="https://vitejs.dev/" newTab>
          Vite
        </Link>
      </p>
    </div>
  );
}

export default App;
