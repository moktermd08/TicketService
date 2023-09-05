# JavaScript - DWP Ticketing Service test 
 Ticket Service Project development for DWP coding challenge 

## Plan of Action
This section outlines the plan of action for the Ticket Service Project, breaking down the tasks to guide the development process.

## Implementation Details

### Validation and Calculation

The `TicketService` class contains a private method `#validateAndCalculate()` which performs the following tasks:

1. Validates ticket types based on available options (Adult, Child, Infant).
2. Validates the ticket count, ensuring not more than 20 tickets are purchased.
3. Calculates the total cost based on ticket type and quantity.
4. Calculates the total number of seats to reserve, excluding infants as they do not require a seat.

### Service Calls

After successful validation and calculation, the `TicketService` class makes subsequent service calls:

1. A payment request is made to `TicketPaymentService` with the total calculated cost.
2. A seat reservation request is sent to `SeatReservationService` with the total number of seats to be reserved.

### Error Handling

The system is designed to handle invalid purchase requests gracefully:

- If any business rule or constraint is violated, an `InvalidPurchaseException` is thrown to indicate an invalid ticket purchase request.

### Testing

The codebase is rigorously tested to ensure it meets all business rules and edge cases:

1. Unit tests validate the ticket calculation logic.
2. Mock tests simulate service calls to `TicketPaymentService` and `SeatReservationService`.



## Project structure 
```
TicketService/
├── package.json
├── src/
│   ├── pairtest/
│   │   ├── lib/
│   │   │   ├── InvalidPurchaseException.js
│   │   │   └── TicketTypeRequest.js
│   │   └── TicketService.js
│   └── thirdparty/
│       ├── paymentgateway/
│       │   └── TicketPaymentService.js
│       └── seatbooking/
│           └── SeatReservationService.js
└── test/
    └── TicketService.test.js

```

## Table of Contents

1. [Objective](#objective)
2. [Business Rules](#business-rules)
3. [Constraints and Assumptions](#constraints-and-assumptions)
4. [Solution](#solution)
5. [Getting Started](#getting-started)
6. [Running the Tests](#running-the-tests)

---

## Objective

The main objective of this project is to provide a working implementation of a `TicketService` that handles ticket purchases. This exercise allows the demonstration of coding skills, adherence to given business rules, and creation of testable, reusable, and maintainable code.

## Business Rules

- Three types of tickets: Infant, Child, and Adult.
- The ticket prices are £0 for Infant, £10 for Child, and £20 for Adult.
- The purchaser declares the type and count of tickets they wish to buy.
- Multiple tickets can be purchased at a time.
- A maximum of 20 tickets can be purchased at once.
- Infants do not pay and do not require a seat.
- Child and Infant tickets cannot be purchased without an Adult ticket.

## Constraints and Assumptions

- The `TicketService` interface should not be modified.
- The third-party package code should not be modified.
- The `TicketTypeRequest` should be an immutable object.
- All accounts with an ID greater than zero are valid.
- Payment and seat reservation services are assumed to be fault-free.

## Solution

The project uses the Factory Pattern to create instances of `TicketService`. This service validates ticket purchase requests against a set of rules and constraints before proceeding with payment and seat reservation. All of this is done in a modular, testable, and maintainable way.

The code is written in ES6 and strictly adheres to good coding practices, including meaningful variable names and extensive commenting for maximum readability and maintainability. 

## Getting Started

### Prerequisites

- Node.js
- npm
- Jest (for testing)

### Installation

1. Clone the repository to your local machine.
git clone https://github.com/moktermd08/TicketService.git

2. Navigate to the project directory.
cd TicketService ( project folder name )

3. Install the required packages.
npm install

4. Test.
npm test


