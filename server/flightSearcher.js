const Amadeus = require('amadeus');
require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

function formatToISODate(dateString) {
  const [month, day, year] = dateString.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function calculateDuration(departureDate, returnDate) {
  const departure = new Date(departureDate);
  const returnDateObj = new Date(returnDate);

  if (isNaN(departure.getTime()) || isNaN(returnDateObj.getTime())) {
    throw new Error('Invalid date format');
  }

  const duration = Math.abs(returnDateObj - departure) / (1000 * 60 * 60 * 24);
  console.log(`Duration: ${duration} days`);
  return duration;
}

async function findDestinationsWithinBudget(
  origin,
  departureDate,
  returnDate,
  budget
) {
  // Convert dates to ISO format
  const isoDepartureDate = formatToISODate(departureDate);
  const isoReturnDate = formatToISODate(returnDate);

  const duration = calculateDuration(isoDepartureDate, isoReturnDate);

  try {
    console.log('Searching flights from:', origin);
    const response = await amadeus.shopping.flightDestinations.get({
      origin: origin,
      departureDate: isoDepartureDate,
      duration: duration,
      maxPrice: budget,
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    const flightOptions = response.data.map((flight) => ({
      destination: flight.destination,
      departureDate: flight.departureDate,
      returnDate: flight.returnDate,
      price: parseFloat(flight.price.total),
    }));

    return flightOptions.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

module.exports = { findDestinationsWithinBudget };
