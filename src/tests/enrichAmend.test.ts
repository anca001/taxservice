/* eslint-disable @typescript-eslint/no-explicit-any */
import { enrichAmend } from "../middleware/enrichAmend";
describe("Enrich amendment test", () => {
  it("it should enrich and return EnrichedEvent", () => {
    const mockRequest: any = {
      body: {
        date: "2021-12-12T12:00:00Z",
        invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791821",
        itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
        cost: 10,
        taxRate: 0.2,
      },
    };
    const mockResponse: any = { locals: {} };
    const next = jest.fn();

    enrichAmend(mockRequest, mockResponse, next);

    expect(mockResponse.locals.enrichedEvent).toEqual({
      date: "2021-12-12T12:00:00Z",
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791821",
      itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
      cost: 10,
      taxRate: 0.2,
      totalTax: 2,
      timestamp: 1639310400000,
    });
    expect(next).toHaveBeenCalled();
  });
});
