import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "react-query";

const mockCategories = ["Electronics", "Category 15"];
const mockProducts = [
  {
    id: 499,
    name: "Bluetooth Speaker",
    category: "Electronics",
    brand: "Brand E",
    price: 350.77,
    rating: 3.5,
    imageUrl: "/medium.webp",
  },
  {
    id: 500,
    name: "Leather Jacket",
    category: "Electronics",
    brand: "Brand L",
    price: 468.97,
    rating: 3.1,
    imageUrl: "/medium.webp",
  },
];

const renderWithProvider = (ui) => {
  return render(
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>,
  );
};

vi.mock("react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
    useInfiniteQuery: vi.fn(),
  };
});

describe("App", () => {
  it("renders the Header, Sidebar, and main product area", () => {
    renderWithProvider(<App />);

    screen.debug();

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("product-area")).toBeInTheDocument();
  });

  it("shows loading state while content is loading", () => {
    useInfiniteQuery.mockImplementation(() => {
      return {
        data: [],
        isLoading: true,
        error: null,
      };
    });

    renderWithProvider(<App />);

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });
});

describe("Filter Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
    useQuery.mockImplementation((key) => {
      if (key === "categories-data") {
        return {
          data: mockCategories,
          isLoading: false,
          error: null,
        };
      }

      return { data: [], isLoading: false, error: null };
    });

    useInfiniteQuery.mockImplementation(() => {
      return {
        data: {
          pages: [
            {
              page: mockProducts,
            },
          ],
          pageParams: [],
        },
        isLoading: false,
        error: null,
      };
    });

    renderWithProvider(<App />);
  });

  it("filters products by category", () => {
    fireEvent.click(screen.getByTestId("category-filter-toggle"));
    fireEvent.click(screen.getByTestId("category-filter-option-Electronics"));

    const products = screen.getAllByTestId("product-item");
    products.forEach((product) => {
      expect(product).toHaveTextContent("Category:");
    });
  });
});
