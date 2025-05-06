const Amadeus = require('amadeus');
require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

function calculateDuration(departureDate, returnDate) {
  const departure = new Date(departureDate);
  const returnDateObj = new Date(returnDate);

  if (isNaN(departure.getTime()) || isNaN(returnDateObj.getTime())) {
    throw new Error('Invalid date format');
  }

  const duration =
    Math.abs(returnDateObj - departure) / (1000 * 60 * 60 * 24) + 1;
  console.log(`Duration: ${duration} days`);
  return duration;
}

async function findDestinationsWithinBudget(
  origin,
  departureDate,
  returnDate,
  budget
) {
  const duration = calculateDuration(departureDate, returnDate);

  try {
    console.log('Searching flights from:', origin);
    const response = await amadeus.shopping.flightDestinations.get({
      origin: origin,
      departureDate: departureDate,
      duration: duration,
      maxPrice: budget,
    });

    console.log('Flight search response:', JSON.stringify(response.data));

    if (!response.data || response.data.length === 0) {
      return [];
    }

    const flightOptions = response.data.map((flight) => ({
      destination: flight.destination,
      departureDate: flight.departureDate,
      returnDate: flight.returnDate,
      price: {
        total: flight.price.total,
      },
    }));

    return flightOptions;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

module.exports = { findDestinationsWithinBudget };
