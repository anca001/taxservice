/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateTransactionValues } from "../middleware/validateTransactionValues";
describe("Transaction Type validation tests", () => {
  it("res status should be 400 if no eventType provided", () => {
    const mockRequest: any = {
      body: {
        eventType: "",
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
    validateTransactionValues(mockRequest, mockResponse, next);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      `Invalid transaction type, should be SALES or TAX_PAYMENT, type provided was ${mockRequest.body.eventType}`,
    );
    expect(next).not.toHaveBeenCalled();
  });
  it("res status should be 400 if eventType is not SALES or TAX_PAYMENT", () => {
    const mockRequest: any = {
      body: {
        eventType: "test",
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
    validateTransactionValues(mockRequest, mockResponse, next);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      `Invalid transaction type, should be SALES or TAX_PAYMENT, type provided was ${mockRequest.body.eventType}`,
    );
    expect(next).not.toHaveBeenCalled();
  });
  it("should call next if eventType is SALES", () => {
    const mockRequest: any = {
      body: {
        eventType: "SALES",
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
    validateTransactionValues(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});
