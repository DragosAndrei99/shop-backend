import { getProductsByIdFunction } from "./getProductsById";
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

describe('getProductsById lambda tests', () => {
  it('Should return one product and 200 status code', async () => {
    mockProductService.getProductById.mockResolvedValueOnce(Promise.resolve(mockDataProductList[0]));
    const statusCode = 200;
    const received = await (getProductsByIdFunction(mockProductService))(event);   
    expect(received).toEqual(formatJSONResponse(mockDataProductList[0], statusCode));
  });
  it('Should return error message and 404 status code if no product exists', async () => {
    mockProductService.getProductById.mockResolvedValueOnce(undefined);
    const statusCode = 404;
    let newError: ICustomErr = { message: "Product not found" };
    const received = await (getProductsByIdFunction(mockProductService))(event);   
    expect(received).toEqual(formatJSONResponse(newError, statusCode));
  });
});