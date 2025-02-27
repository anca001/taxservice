/* eslint-disable @typescript-eslint/no-explicit-any */
import { enrichEvent } from "../middleware/enrichEvent";
describe("Enrich event test", () => {
  it("it should enrich and return EnrichedEvent", () => {
    const mockRequest: any = {
      body: {
        date: "2021-12-12T12:00:00Z",
        eventType: "SALES",
        items: [
          {
            itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
            cost: 10,
            taxRate: 0.2,
          },
        ],
      },
    };
    const mockResponse: any = { locals: {} };
    const next = jest.fn();

    enrichEvent(mockRequest, mockResponse, next);

    expect(mockResponse.locals.enrichedEvent).toEqual({
      date: "2021-12-12T12:00:00Z",
      eventType: "SALES",
      items: [
        {
          itemId: "02db47b6-fe68-4005-a827-24c6e962fnew",
          cost: 10,
          taxRate: 0.2,
        },
      ],
      totalTax: 2,
      timestamp: 1639310400000,
    });
    expect(next).toHaveBeenCalled();
  });
});
