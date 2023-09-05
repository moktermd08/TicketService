// Importing required modules
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

// Factory function to encapsulate the creation logic for TicketService instances
const TicketServiceFactory = () => new TicketService();

// TicketService class definition
class TicketService {
  /**
   * The only public method for TicketService instances.
   * @param {number} accountId - The id for the account initiating the purchase.
   * @param {Array} ticketTypeRequests - List of TicketTypeRequest objects describing the tickets to be purchased.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      // Validation and Calculation Logic
      const { totalCost, totalSeats } = this.#validateAndCalculate(ticketTypeRequests);

      // Try making a payment request via TicketPaymentService
      if (!TicketPaymentService.processPayment(accountId, totalCost)) {
        throw new Error('Payment processing failed.');
      }

      // Try reserving seats via SeatReservationService
      if (!SeatReservationService.reserveSeats(accountId, totalSeats)) {
        throw new Error('Seat reservation failed.');
      }
    } catch (e) {
      // Re-throw as a custom exception for unified handling
      throw new InvalidPurchaseException(e.message);
    }
  }

  /**
   * A private method that handles ticket validation and performs cost and seat calculations.
   * @param {Array} ticketTypeRequests - An array of TicketTypeRequest instances.
   * @returns {Object} An object containing the total cost and total seats to be reserved.
   */
  #validateAndCalculate = (ticketTypeRequests) => {
    // Initialize variables to hold various counts and totals
    let totalCost = 0, totalSeats = 0, adultCount = 0, childAndInfantCount = 0;

    // Static ticket pricing map for easy lookup and future modification
    const ticketPricing = { 'ADULT': 20, 'CHILD': 10, 'INFANT': 0 };

    // Loop through each ticket request to validate and calculate costs
    for (const request of ticketTypeRequests) {
      // Validate ticket type
      if (!ticketPricing.hasOwnProperty(request.type)) {
        throw new InvalidPurchaseException('Invalid ticket type.');
      }

      // Validate ticket count
      if (request.count <= 0) {
        throw new InvalidPurchaseException('Ticket count should be greater than zero.');
      }

      // Update counts for adult, child, and infant tickets
      adultCount += (request.type === 'ADULT') ? request.count : 0;
      childAndInfantCount += (['CHILD', 'INFANT'].includes(request.type)) ? request.count : 0;

      // Calculate cost and seats
      totalCost += ticketPricing[request.type] * request.count;
      if (request.type !== 'INFANT') totalSeats += request.count;
    }

    // Validate total ticket count against the business rule
    if (totalSeats > 20) {
      throw new InvalidPurchaseException('Cannot purchase more than 20 tickets.');
    }

    // Validate the requirement of at least one adult ticket if any child or infant tickets are purchased
    if (childAndInfantCount > 0 && adultCount === 0) {
      throw new InvalidPurchaseException('Child and Infant tickets require at least one Adult ticket.');
    }

    return { totalCost, totalSeats };
  };
}

// Exporting the factory function for external usage
export default TicketServiceFactory;
