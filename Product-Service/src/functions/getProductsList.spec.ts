import { getProductsListFunction } from "./getProductsList";
import mockDataProductList from "../services/mock-data/mockDataProductList";
import { formatJSONResponse } from "../libs/api-gateway";
import createEvent from "mock-aws-events";
import { ICustomErr } from "src/types/api-types";

let mockProductService : {getProductById: jest.Mock, getAllProducts: jest.Mock};
const event = createEvent("aws:apiGateway", {} );

beforeEach(() => {
  mockProductService = {
    getProductById : jest.fn(),
    getAllProducts: jest.fn()
  }
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('getProductsList lambda tests', () => {
  it('Should return full array of products and 200 status code', async () => {
    mockProductService.getAllProducts.mockResolvedValueOnce(Promise.resolve(mockDataProductList));
    const statusCode = 200;
    const received = await (getProductsListFunction(mockProductService))(event);   
    expect(received).toEqual(formatJSONResponse(mockDataProductList, statusCode));
  });
  it('Should return error message and 404 status code if no products exist', async () => {
    mockProductService.getAllProducts.mockResolvedValueOnce(Promise.resolve([]));
    const statusCode = 404;
    let newError: ICustomErr = { message: "No products available" };
    const received = await (getProductsListFunction(mockProductService))(event);   
    expect(received).toEqual(formatJSONResponse(newError, statusCode));
  });
});