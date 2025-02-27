/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateTaxPositionDate } from "../middleware/validateTaxPositionDate";
describe("Tax Position Date validation tests", () => {
  it("res status should be 400 if no date provided", () => {
    const mockRequest: any = {
      query: {
        date: "",
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateTaxPositionDate(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Please provide a date");
    expect(next).not.toHaveBeenCalled();
  });
  it("res status should be 400 if date is not in ISO 8601 format", () => {
    const mockRequest: any = {
      query: {
        date: "2021-12-12",
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateTaxPositionDate(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "Invalid date format, needs to be ISO 8601",
    );
    expect(next).not.toHaveBeenCalled();
  });
  it("should call next if date is provided and in ISO 8601 format", () => {
    const mockRequest: any = {
      query: {
        date: "2021-12-12T12:00:00Z",
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateTaxPositionDate(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});
