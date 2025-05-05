const Amadeus = require('amadeus');
require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

async function findDestinationsWithinBudget(
  origin,
  departureDate,
  returnDate,
  maxBudget
) {
  try {
    const duration = Math.ceil(
      (new Date(returnDate).getTime() - new Date(departureDate).getTime()) /
        (1000 * 3600 * 24)
    );

    const response = await amadeus.shopping.flightDestinations.get({
      origin,
      maxPrice: maxBudget,
      departureDate,
      oneWay: false,
      duration: duration,
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
