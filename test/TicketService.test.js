const TicketServiceFactory = require('../src/pairtest/TicketService');
const TicketTypeRequest = require('../src/pairtest/lib/TicketTypeRequest');
const InvalidPurchaseException = require('../src/pairtest/lib/InvalidPurchaseException');
const TicketPaymentService = require('../src/thirdparty/paymentgateway/TicketPaymentService');
const SeatReservationService = require('../src/thirdparty/seatbooking/SeatReservationService');

// Mock the third-party services
jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService');

describe('TicketService', () => {
  let service;

  beforeEach(() => {
    // Initialize a new service instance before each test
    service = TicketServiceFactory();
    // Clear any previous mock calls to third-party services
    TicketPaymentService.processPayment.mockClear();
    SeatReservationService.reserveSeats.mockClear();
  });

  // Test for a valid ticket purchase
  it('should successfully purchase tickets when the request is valid', () => {
    const accountId = 1; // Mock account ID
    const requests = [
      new TicketTypeRequest('ADULT', 1),
      new TicketTypeRequest('CHILD', 1),
      new TicketTypeRequest('INFANT', 1)
    ];

    // Execute the ticket purchase
    service.purchaseTickets(accountId, ...requests);

    // Assert the correct amount is sent to TicketPaymentService
    expect(TicketPaymentService.processPayment).toHaveBeenCalledWith(accountId, 30);

    // Assert the correct seat count is sent to SeatReservationService
    expect(SeatReservationService.reserveSeats).toHaveBeenCalledWith(accountId, 2);
  });

  // Test for ticket purchase with no adults
  it('should throw an error when no adult tickets are purchased but child or infant tickets are', () => {
    const accountId = 1;
    const requests = [
      new TicketTypeRequest('CHILD', 1),
      new TicketTypeRequest('INFANT', 1)
    ];

    // Assert an error is thrown
    expect(() => service.purchaseTickets(accountId, ...requests)).toThrow(InvalidPurchaseException);
  });

  // Test for ticket purchase exceeding the 20-ticket limit
  it('should throw an error when more than 20 tickets are purchased', () => {
    const accountId = 1;
    const requests = [
      new TicketTypeRequest('ADULT', 10),
      new TicketTypeRequest('CHILD', 11)
    ];

    // Assert an error is thrown
    expect(() => service.purchaseTickets(accountId, ...requests)).toThrow(InvalidPurchaseException);
  });

  // Test for invalid ticket type
  it('should throw an error when an invalid ticket type is used', () => {
    const accountId = 1;
    const requests = [
      new TicketTypeRequest('UNKNOWN', 1)
    ];

    // Assert an error is thrown
    expect(() => service.purchaseTickets(accountId, ...requests)).toThrow(InvalidPurchaseException);
  });
});