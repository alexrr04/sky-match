const SKYSCANNER_API_KEY = process.env.SKYSCANNER_API_KEY;
const SKYSCANNER_API_URL = 'https://partners.api.skyscanner.net/apiservices/v3/flights/indicative/search';

interface Quote {
  minPrice: {
    amount: string;
    unit: string;
  };
  isDirect: boolean;
  outboundLeg: {
    originPlaceId: string;
    destinationPlaceId: string;
    marketingCarrierId: string;
  };
}

interface FlightSearchRequest {
  query: {
    market: string;
    locale: string;
    currency: string;
    queryLegs: {
      originPlace: {
        queryPlace: {
          iata: string;
        };
      };
      destinationPlace: {
        anywhere: boolean;
      };
      fixedDate: {
        year: number;
        month: number;
        day: number;
      };
    }[];
  };
}

interface FlightOption {
  destination: string;
  price: number;
  outboundFlight: {
    airline: string;
    isDirect: boolean;
  };
  returnFlight?: {
    airline: string;
    isDirect: boolean;
  };
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

async function findDestinationsWithinBudget(
  origin: string,
  departureDate: string,
  returnDate: string,
  maxBudget: number
): Promise<FlightOption[]> {
  try {
    if (!SKYSCANNER_API_KEY) {
      throw new Error('SKYSCANNER_API_KEY environment variable is not set');
    }

    // Search outbound flights
    const outboundRequest: FlightSearchRequest = {
      query: {
        market: 'ES',
        locale: 'en-GB',
        currency: 'EUR',
        queryLegs: [
          {
            originPlace: {
              queryPlace: {
                iata: origin
              }
            },
            destinationPlace: {
              anywhere: true
            },
            fixedDate: parseDate(departureDate)
          }
        ]
      }
    };

    const headers = new Headers();
    headers.append('x-api-key', SKYSCANNER_API_KEY);
    headers.append('Content-Type', 'application/json');

    // Fetch outbound flights
    const outboundResponse = await fetch(SKYSCANNER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(outboundRequest)
    });

    const outboundData = await outboundResponse.json();
    if (outboundData?.status !== 'RESULT_STATUS_COMPLETE' || !outboundData?.content?.results) {
      throw new Error('Failed to fetch outbound flights');
    }

    // Process outbound results
    const destinations = new Map<string, FlightOption>();
    const { quotes: outboundQuotes, carriers, places } = outboundData.content.results;

    for (const quote of Object.values(outboundQuotes as Record<string, Quote>)) {
      const destination = places[quote.outboundLeg.destinationPlaceId];
      const airline = carriers[quote.outboundLeg.marketingCarrierId];
      const price = parseInt(quote.minPrice.amount);

      // Only consider destinations within half the budget for outbound flight
      if (price <= maxBudget / 2) {
        destinations.set(destination.iata, {
          destination: `${destination.name} (${destination.iata})`,
          price: price,
          outboundFlight: {
            airline: airline.name,
            isDirect: quote.isDirect
          }
        });
      }
    }

    // For each potential destination, search return flights
    const finalDestinations: FlightOption[] = [];

    for (const [destIata, outboundInfo] of destinations) {
      const returnRequest: FlightSearchRequest = {
        query: {
          market: 'ES',
          locale: 'en-GB',
          currency: 'EUR',
          queryLegs: [
            {
              originPlace: {
                queryPlace: {
                  iata: destIata
                }
              },
              destinationPlace: {
                anywhere: true
              },
              fixedDate: parseDate(returnDate)
            }
          ]
        }
      };

      const returnResponse = await fetch(SKYSCANNER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(returnRequest)
      });

      const returnData = await returnResponse.json();
      if (returnData?.status === 'RESULT_STATUS_COMPLETE' && returnData?.content?.results) {
        const { quotes: returnQuotes, carriers: returnCarriers } = returnData.content.results;

        for (const returnQuote of Object.values(returnQuotes as Record<string, Quote>)) {
          const returnAirline = returnCarriers[returnQuote.outboundLeg.marketingCarrierId];
          const totalPrice = outboundInfo.price + parseInt(returnQuote.minPrice.amount);

          if (totalPrice <= maxBudget) {
            finalDestinations.push({
              ...outboundInfo,
              price: totalPrice,
              returnFlight: {
                airline: returnAirline.name,
                isDirect: returnQuote.isDirect
              }
            });
            break; // Take the first valid return flight found
          }
        }
      }
    }

    // Sort by price
    return finalDestinations.sort((a, b) => a.price - b.price);

  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

async function displayPossibleDestinations(
  origin: string,
  departureDate: string,
  returnDate: string,
  maxBudget: number
): Promise<void> {
  console.log(`\nSearching destinations from ${origin}`);
  console.log(`Departure: ${departureDate}`);
  console.log(`Return: ${returnDate}`);
  console.log(`Maximum budget: €${maxBudget}\n`);

  const destinations = await findDestinationsWithinBudget(
    origin,
    departureDate,
    returnDate,
    maxBudget
  );

  if (destinations.length === 0) {
    console.log('No destinations found within budget.');
    return;
  }

  destinations.forEach(destination => {
    console.log(`${destination.destination} - €${destination.price}`);
    console.log(`  Outbound: ${destination.outboundFlight.airline}${destination.outboundFlight.isDirect ? ' (direct)' : ' (with stops)'}`);
    if (destination.returnFlight) {
      console.log(`  Return: ${destination.returnFlight.airline}${destination.returnFlight.isDirect ? ' (direct)' : ' (with stops)'}`);
    }
    console.log('-----------------------------------');
  });
}

// Example usage
async function main() {
  await displayPossibleDestinations(
    'BCN',  // Origin airport
    '2025-07-15',  // Departure date
    '2025-07-22',  // Return date
    500  // Maximum budget in EUR
  );
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { findDestinationsWithinBudget, displayPossibleDestinations };
