const Amadeus = require('amadeus');
require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

async function findDestinationsWithinBudget(origin) {
  try {
    console.log('Searching flights from:', origin);
    const response = await amadeus.shopping.flightDestinations.get({
      origin,
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
