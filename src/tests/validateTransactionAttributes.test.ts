/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateTransactionAttributes } from "../middleware/validateTransactionAttributes";
describe("Transaction validation tests", () => {
  it("res status should be 400 if no date provided", () => {
    const mockRequest: any = {
      body: {
        eventType: "transaction",
        date: "",
        amount: 10,
        currency: "USD",
        from: "123",
        to: "456",
      },
    };
    const mockResponse: any = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateTransactionAttributes(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid transaction");
    expect(next).not.toHaveBeenCalled();
  });
  it("res status should be 400 if date is not in ISO 8601 format", () => {
    const mockRequest: any = {
      body: {
        eventType: "transaction",
        date: "2021-12-12",
        amount: 10,
        currency: "USD",
        from: "123",
        to: "456",
      },
    };
    const mockResponse: any = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateTransactionAttributes(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "Invalid date format, needs to be ISO 8601",
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if date is provided and in ISO 8601 format", () => {
    const mockRequest: any = {
      body: {
        eventType: "transaction",
        date: "2021-12-12T12:00:00Z",
        amount: 10,
        currency: "USD",
        from: "123",
        to: "456",
      },
    };
    const mockResponse: any = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateTransactionAttributes(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});
