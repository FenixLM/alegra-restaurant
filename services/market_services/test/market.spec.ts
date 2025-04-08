import axios from "axios";
import { buyIngredient } from "../services/marketService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("buyIngredient", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar cantidad comprada cuando hay stock", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { quantitySold: 5 },
    });

    const result = await buyIngredient("tomato");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://recruitment.alegra.com/api/farmers-market/buy",
      { params: { ingredient: "tomato" } }
    );

    expect(result).toEqual({
      name: "tomato",
      quantity: 5,
    });
  });

  it("debe retornar 0 cuando no hay stock", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { quantitySold: 0 },
    });

    const result = await buyIngredient("lettuce");

    expect(result).toEqual({
      name: "lettuce",
      quantity: 0,
    });
  });

  it("debe manejar errores y retornar quantity 0", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Request failed"));

    const result = await buyIngredient("onion");

    expect(result).toEqual({
      name: "onion",
      quantity: 0,
    });
  });
});
