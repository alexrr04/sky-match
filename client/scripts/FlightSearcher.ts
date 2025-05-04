import { SKYSCANNER_API_KEY, SKYSCANNER_API_URL } from '@/scripts/config.js';

interface FlightOption {
  destination: string;
  outboundFlight: {
    airline: string;
    price: number;
    isDirect: boolean;
  };
  returnFlight: {
    airline: string;
    price: number;
    isDirect: boolean;
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
        anywhere?: boolean;
        queryPlace?: {
          iata: string;
        };
      };
      fixedDate: {
        year: number;
        month: number;
        day: number;
      };
    }[];
  };
}

function parseDate(dateStr: string): {
  year: number;
  month: number;
  day: number;
} {
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
                iata: origin,
              },
            },
            destinationPlace: {
              anywhere: true,
            },
            fixedDate: parseDate(departureDate),
          },
        ],
      },
    };

    const headers = new Headers();
    headers.append('x-api-key', SKYSCANNER_API_KEY);
    headers.append('Content-Type', 'application/json');

    const outboundResponse = await fetch(SKYSCANNER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(outboundRequest),
    });

    const outboundData = await outboundResponse.json();
    if (!outboundData?.content?.results) {
      return [];
    }

    const {
      quotes: outboundQuotes,
      carriers: outboundCarriers,
      places,
    } = outboundData.content.results;
    const flightOptions: FlightOption[] = [];

    // Process outbound flights
    for (const quote of Object.values(outboundQuotes as Record<string, any>)) {
      const destination = places[quote.outboundLeg.destinationPlaceId];
      const destinationIata = destination.iata;
      const outboundPrice = parseInt(quote.minPrice.amount);

      // Search return flights for this destination
      const returnRequest: FlightSearchRequest = {
        query: {
          market: 'ES',
          locale: 'en-GB',
          currency: 'EUR',
          queryLegs: [
            {
              originPlace: {
                queryPlace: {
                  iata: destinationIata,
                },
              },
              destinationPlace: {
                queryPlace: {
                  iata: origin,
                },
              },
              fixedDate: parseDate(returnDate),
            },
          ],
        },
      };

      const returnResponse = await fetch(SKYSCANNER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(returnRequest),
      });

      const returnData = await returnResponse.json();
      if (!returnData?.content?.results?.quotes) {
        continue;
      }

      const { quotes: returnQuotes, carriers: returnCarriers } =
        returnData.content.results;

      for (const returnQuote of Object.values(
        returnQuotes as Record<string, any>
      )) {
        const outboundAirline =
          outboundCarriers[quote.outboundLeg.marketingCarrierId];
        const returnAirline =
          returnCarriers[returnQuote.outboundLeg.marketingCarrierId];
        const returnPrice = parseInt(returnQuote.minPrice.amount);

        // Only include if total price is within budget
        if (outboundPrice + returnPrice <= maxBudget) {
          flightOptions.push({
            destination: `${destination.name} (${destinationIata})`,
            outboundFlight: {
              airline: outboundAirline.name,
              price: outboundPrice,
              isDirect: quote.isDirect,
            },
            returnFlight: {
              airline: returnAirline.name,
              price: returnPrice,
              isDirect: returnQuote.isDirect,
            },
          });
        }
      }
    }

    return flightOptions.sort(
      (a, b) =>
        a.outboundFlight.price +
        a.returnFlight.price -
        (b.outboundFlight.price + b.returnFlight.price)
    );
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

// Example usage
async function main() {
  const result = await findDestinationsWithinBudget(
    'BCN',
    '2025-07-15',
    '2025-07-22',
    500
  );

  result.forEach((option) => {
    console.log(`${option.destination}`);
    console.log(
      `Outbound: ${option.outboundFlight.airline} - €${
        option.outboundFlight.price
      }${option.outboundFlight.isDirect ? ' (direct)' : ' (with stops)'}`
    );
    console.log(
      `Return: ${option.returnFlight.airline} - €${option.returnFlight.price}${
        option.returnFlight.isDirect ? ' (direct)' : ' (with stops)'
      }`
    );
    console.log(
      `Total: €${option.outboundFlight.price + option.returnFlight.price}`
    );
    console.log('-----------------------------------');
  });
}

// Run main function if this is the entry point
if (process.argv[1] === import.meta.url) {
  main().catch(console.error);
}

export { findDestinationsWithinBudget };
