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
    // Validation and Calculation Logic
    const { totalCost, totalSeats } = this.#validateAndCalculate(ticketTypeRequests);

    // Make a payment request via TicketPaymentService
    TicketPaymentService.processPayment(accountId, totalCost);

    // Reserve seats via SeatReservationService
    SeatReservationService.reserveSeats(accountId, totalSeats);
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
    ticketTypeRequests.forEach(request => {
      // Validate ticket type
      if (!ticketPricing.hasOwnProperty(request.type)) {
        throw new InvalidPurchaseException('Invalid ticket type.');
      }

      // Update adult ticket count for later validation
      if (request.type === 'ADULT') adultCount += request.count;

      // Update child and infant ticket count for later validation
      if (['CHILD', 'INFANT'].includes(request.type)) childAndInfantCount += request.count;

      // Validate ticket count
      if (request.count <= 0) throw new InvalidPurchaseException('Ticket count should be greater than zero.');

      // Calculate total cost and seats
      totalCost += ticketPricing[request.type] * request.count;
      if (request.type !== 'INFANT') totalSeats += request.count;
    });

    // Validate total ticket count against the business rule
    if (totalSeats > 20) throw new InvalidPurchaseException('Cannot purchase more than 20 tickets.');

    // Validate the requirement of at least one adult ticket if any child or infant tickets are purchased
    if (childAndInfantCount > 0 && adultCount === 0) throw new InvalidPurchaseException('Child and Infant tickets require at least one Adult ticket.');

    // Return the calculated totals for further action
    return { totalCost, totalSeats };
  };
}

// Exporting the factory function for external usage
export default TicketServiceFactory;