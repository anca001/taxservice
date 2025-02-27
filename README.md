# taxservice

# Prerequisites
You will need node v22

# Running and testing the service
Install dependencies
`npm install`

To start server
`npm run start`

To run in dev mode with hot reload:
`npm run dev`

You can also run this in Docker should you wish to, this will require Docker to be installed: 
`docker compose up` in the root directory


# Implementation structure
The tax service is built using Node.js with TypeScript and follows a layered architecture pattern:
* **Express Router**: All HTTP endpoints are defined in the transactions.ts router file, which handles incoming requests and delegates them to the appropriate service methods.
* **Middleware Layer**: Request validation is primarily implemented as middleware functions that run before the route handlers. These middleware functions validate request bodies, query parameters, and ensure data consistency before processing.
* **Service Layer**: The transactionService contains the core business logic for:
    * Processing sales and tax payment transactions
    * Calculating tax positions based on date
    * Handling sales amendments
    * Consolidating data for responses
* **Repository Layer**: The transactionRepository provides an abstraction over the data storage mechanism. It handles:
    * Storing and retrieving transaction data
    * Managing the in-memory database
    * Providing methods for querying transactions by various criteria
* **Data Storage**: Currently implemented as an in-memory storage solution, but designed with abstraction to allow easy replacement with a persistent database in the future.
This separation of concerns makes the codebase more maintainable and testable, while the abstraction layers ensure that components like the data storage can be replaced without affecting the rest of the application.

# Assumptions and design decisions
Given the scope of the task and the service only consisting of three main endpoints, to keep the implementation focused on core functionality while ensuring maintainability and scope for enhancing, the following design decisions were made:
* **In memory store**: Since this is a proof-of-concept and a single-user service, I decided to use a in-memory data structure (an array of objects) which is sufficient to track single-user transactions efficiently. I have implemented an abstraction layer using the `TransactionRepository` interface, which allows for store to be swapped to a different kind of database as a potential future enhancement.
* **Amendment approach**: Since users should be able to amend a sales event that has not yet been received, the /sale endpoint allows creating sales records through the amendment process. However, to ensure data integrity, the /transactions endpoint does not allow for overwriting existing transactions.
* **InvoiceID** can be used as a unique identifier for sales. ItemIDs are also assumed to be unique within a sale. 


# Endpoints
**Transactions**
* GET /transactions - Retrieves all transactions.
* POST /transactions - Adds a new transaction (sale or tax payment).
Example request body:
`
{
    "eventType": "SALES",
    "date": "2024-02-14T17:29:39Z",
    "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791821",
    "items": [
        {
            "itemId": "02db47b6-fe68-4005-a827-24c6e962f3ml",
            "cost": 1000,
            "taxRate": 0.2
        },
        {
            "itemId": "02db47b6-fe69-4005-a827-24c6e962f3kd",
            "cost": 700,
            "taxRate": 0.2
        }
    ]
}
`

**Sales**
* GET /sales - Retrieves all sales.
* PATCH /sale - Amends an existing sale.

Example request body:
`
{
    "date": "2024-02-14T17:29:39Z",
    "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791821",
    "itemId": "02db47b6-fe68-4005-a827-24c6e962fnew",
    "cost": 100,
    "taxRate": 0.4
}
`

**Tax Payments**
* GET /tax-payments - Retrieves all tax payment transactions.
Tax Position
* GET /tax-position?date=2024-02-22T17:29:39Z - Computes the tax position up to a given date.

# Test coverage
Included comprehensive unit tests for the middleware. 
To run tests:
`npm run test`


# Thoughts & Future enhancements
**Persisted storage**: implemented abstractions such as the `Transaction Repository` which should enable the service to be scaled by swapping the current data storage with a persisted storage method.

**Validation**: is handled in the middleware, can be expanded to cover more transaction fields.

**Observability**: I have included Winston logs, however other metrics can also be collected and visualised by integrating more observability tools, for example Prometheus and Grafana. 

**Testing suite**: although I have included middleware unit tests, the testing suite can be expanded with integration and end-to-end tests.