import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest"
import App from "../src/App";
import { QueryClient, QueryClientProvider } from "react-query";

describe("App", () => {
  it("renders the App component", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    screen.debug(); // prints out the jsx in the App component unto the command line
  });
});
