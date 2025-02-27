/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateAmendment } from "../middleware/validateAmendment";
describe("Amendment validation tests", () => {
  it("res status should be 400 if no date provided", () => {
    const mockRequest: any = {
      body: {
        date: "",
        invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791821",
        itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
        cost: 10,
        taxRate: 0.2,
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateAmendment(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Please provide a date");
    expect(next).not.toHaveBeenCalled();
  });

  it("res status should be 400 if date is not in ISO 8601 format", () => {
    const mockRequest: any = {
      body: {
        date: "2021-12-12",
        invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791821",
        itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
        cost: 10,
        taxRate: 0.2,
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateAmendment(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "Invalid date format, needs to be ISO 8601",
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("res status should be 400 if no itemId provided", () => {
    const mockRequest: any = {
      body: {
        date: "2021-12-12T12:00:00Z",
        invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791821",
        itemId: "",
        cost: 10,
        taxRate: 0.2,
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateAmendment(mockRequest, mockResponse, next);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Please provide an itemId");
    expect(next).not.toHaveBeenCalled();
  });

  it(" should call next if date and itemId provided and date is in ISO 8601 format", () => {
    const mockRequest: any = {
      body: {
        date: "2021-12-12T12:00:00Z",
        invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791821",
        itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
        cost: 10,
        taxRate: 0.2,
      },
    };
    const mockResponse: any = {
      locals: {},
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    };
    const next = jest.fn();

    validateAmendment(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalled();
  });
});
